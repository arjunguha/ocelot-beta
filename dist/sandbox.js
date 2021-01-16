"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sandbox = exports.loadLibraries = exports.version = void 0;
const Rx = require("rxjs");
const elementaryJS = require("@stopify/elementary-js");
const elementaryRTS = require("@stopify/elementary-js/dist/runtime");
const state = require("./state");
const errors_1 = require("./errors");
const utils_1 = require("./utils");
const secrets_1 = require("./secrets");
const version_1 = require("./version");
const version_2 = require("@stopify/elementary-js/dist/version");
function version() {
    return {
        elementaryJS: version_2.EJSVERSION,
        ocelot: version_1.OCELOTVERSION
    };
}
exports.version = version;
let whitelistCode = {};
function loadLibraries() {
    return __awaiter(this, void 0, void 0, function* () {
        const wl = yield utils_1.getJson(secrets_1.MODULE_WL_URL);
        for (const module in wl) {
            wl[module] = yield utils_1.getText(wl[module]);
        }
        whitelistCode = wl;
    });
}
exports.loadLibraries = loadLibraries;
// NOTE(arjun): I consider this to be hacky. Stopify should have a
// function to create an AsyncRun that does not run any user code.
function emptyStopifyRunner(opts) {
    const runner = elementaryJS.compile('', opts);
    if (runner.kind === 'error') {
        // Panic situation!
        throw new Error('Could not create empty ElementaryJS.AsyncRun');
    }
    // In theory, this is a race condition. In practice, Stopify is not going
    // to yield control, so the callback will run before the function returns.
    runner.run((result) => {
        if (result.type === 'exception') {
            // Panic situation!
            throw new Error('Could not evaluate empty program with ElementaryJS');
        }
    });
    return runner;
}
/**
 * Implements the web-based sandbox that uses ElementaryJS.
 * The rest of the program should not have to use ElementaryJS.
 *
 * To initialize the sandbox, the following methods must be invoked after
 * construction:
 *
 * 1. setConsole, to hold a reference to the console
 *
 * When the user's program changes, call setCode. Note that this does *not*
 * recompile the program.
 *
 * Finally, use onRunOrTestClick, onConsoleInput, and onStopClicked to actually
 * control program execution.
 *
 */
class Sandbox {
    constructor() {
        this.runner = emptyStopifyRunner(this.opts());
        this.mode = new Rx.BehaviorSubject('stopped');
    }
    setConsole(console) {
        this.repl = console;
    }
    onResult(result, showNormal) {
        if (result.type === 'exception') {
            let message = result.value instanceof Error ?
                result.value.message : String(result.value);
            if (result.stack.length === 0) {
                this.repl.error(message);
                return;
            }
            message = message + ' at ' + result.stack[0];
            if (result.stack.length === 1) {
                this.repl.error(message);
                return;
            }
            this.repl.error(message + '\n... ' +
                result.stack.slice(1).join('\n... '));
        }
        else if (result.type === 'normal' && showNormal) {
            this.repl.log(result.value);
        }
    }
    reportElementaryError(error) {
        for (const err of error.errors) {
            this.repl.error(`Line ${err.line}: ${err.message}`);
        }
    }
    opts() {
        return {
            consoleLog: (message) => this.repl.log(message),
            version, whitelistCode
        };
    }
    onRunOrTestClicked(mode) {
        const currentMode = this.mode.getValue();
        if (currentMode === 'testing' || currentMode === 'running') {
            errors_1.console.error(`Clicked Run while in mode ${this.mode}`);
            return;
        }
        const program = state.currentProgram.getValue();
        if (program.kind !== 'program') {
            errors_1.console.error(`Clicked Run/Test with currentProgram.kind === ${program.kind}`);
            return;
        }
        this.repl.log(new Date().toLocaleString('en-us', { timeZoneName: 'short' }));
        this.repl.log('Compiling...');
        const runner = elementaryJS.compile(program.content, this.opts());
        if (runner.kind === 'error') {
            this.reportElementaryError(runner);
            return;
        }
        this.repl.log('Compilation successful.');
        if (mode === 'running') {
            this.repl.log('Starting program...');
        }
        else if (mode === 'testing') {
            this.repl.log('Running tests...');
        }
        this.runner = runner;
        elementaryRTS.enableTests(mode === 'testing');
        this.mode.next(mode);
        runner.run(result => {
            const currentMode = this.mode.getValue();
            this.onResult(result, false);
            if (currentMode === 'testing' && result.type !== 'exception') {
                const summary = elementaryRTS.summary(true);
                this.repl.log(summary.output, ...summary.style);
            }
            if (currentMode !== 'testing' && result.type === 'normal') {
                this.repl.log('Program terminated normally.');
            }
            this.mode.next('stopped');
        });
    }
    onConsoleInput(userInputLine) {
        const currentMode = this.mode.getValue();
        if (currentMode !== 'stopped') {
            errors_1.console.error(`ERROR: called onConsoleInput with mode = ${currentMode}`);
            return;
        }
        this.repl.echo(userInputLine);
        this.mode.next('running');
        this.runner.eval(userInputLine, (result) => {
            this.mode.next('stopped');
            this.onResult(result, true);
        });
    }
    onStopClicked() {
        const currentMode = this.mode.getValue();
        if (currentMode === 'stopped') {
            errors_1.console.error(`Clicked Stop while in mode ${this.mode}`);
            return;
        }
        if (currentMode === 'stopping') {
            // NOTE(arjun): I think this can happen and is less surprising.
            // E.g., a student may click a button several times
            return;
        }
        this.mode.next('stopping');
        this.runner.stop(() => {
            // NOTE: We do *not* remove the asyncRun object. This will allow
            // a user to continue mucking around in the console after killing a
            // running program.
            this.mode.next('stopped');
        });
    }
}
exports.Sandbox = Sandbox;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuZGJveC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zYW5kYm94LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLDJCQUEyQjtBQUMzQix1REFBdUQ7QUFDdkQscUVBQXFFO0FBRXJFLGlDQUFpQztBQUNqQyxxQ0FBbUM7QUFDbkMsbUNBQTJDO0FBQzNDLHVDQUEwQztBQUMxQyx1Q0FBMEM7QUFDMUMsaUVBQWlFO0FBSWpFLFNBQWdCLE9BQU87SUFDbkIsT0FBTztRQUNILFlBQVksRUFBRSxvQkFBVTtRQUN4QixNQUFNLEVBQUUsdUJBQWE7S0FDeEIsQ0FBQztBQUNOLENBQUM7QUFMRCwwQkFLQztBQUVELElBQUksYUFBYSxHQUE4QixFQUFFLENBQUM7QUFDbEQsU0FBc0IsYUFBYTs7UUFDL0IsTUFBTSxFQUFFLEdBQThCLE1BQU0sZUFBTyxDQUFDLHVCQUFhLENBQUMsQ0FBQztRQUVuRSxLQUFLLE1BQU0sTUFBTSxJQUFJLEVBQUUsRUFBRTtZQUNyQixFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxlQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDMUM7UUFFRCxhQUFhLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7Q0FBQTtBQVJELHNDQVFDO0FBRUQsa0VBQWtFO0FBQ2xFLGtFQUFrRTtBQUNsRSxTQUFTLGtCQUFrQixDQUFDLElBQStCO0lBQ3ZELE1BQU0sTUFBTSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlDLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUU7UUFDekIsbUJBQW1CO1FBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztLQUNuRTtJQUNELHlFQUF5RTtJQUN6RSwwRUFBMEU7SUFDMUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxF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