"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.console = void 0;
const state = require("./state");
const secrets_1 = require("./secrets");
const version_1 = require("@stopify/elementary-js/dist/version");
const version_2 = require("./version");
function getEmail() {
    const v = state.loggedIn.getValue();
    if (v.kind !== 'logged-out') {
        return v.email;
    }
    else {
        return '';
    }
}
function traceError(message) {
    if (window.location.hostname === 'localhost') {
        console.log('WARNING: Cloud error reporting disabled for localhost');
        console.error(`Caught the following error:`);
        console.error(message);
        return;
    }
    const version = `Ocelot ${version_2.OCELOTVERSION}, EJS ${version_1.EJSVERSION}`;
    const userAgent = window.navigator.userAgent;
    const err = {
        username: getEmail(),
        version,
        userAgent,
        message,
        userProgram: state.currentProgram.getValue(),
    };
    let body;
    try {
        body = JSON.stringify(err);
    }
    catch (exn) {
        err.message = String(err.message);
        body = JSON.stringify(err);
    }
    fetch(`${secrets_1.CLD_FN_BASE_URL}error`, {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/json' }
    }).catch(reason => {
        console.error('Failed to log error ', reason);
    });
}
window.addEventListener('error', (errorEvent) => {
    console.error(errorEvent.message);
    traceError(`${errorEvent.message} at line ${errorEvent.lineno}, column ${errorEvent.colno}, file ${errorEvent.filename}`);
});
const tracingConsole = {
    error: function (message) {
        console.error(message);
        traceError(message);
    },
    log: function (message) {
        console.log(message);
        traceError(message);
    }
};
exports.console = tracingConsole;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBaUM7QUFDakMsdUNBQTRDO0FBQzVDLGlFQUFpRTtBQUNqRSx1Q0FBMEM7QUFFMUMsU0FBUyxRQUFRO0lBQ2IsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUVwQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFFO1FBQ3pCLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQztLQUNsQjtTQUFNO1FBQ0gsT0FBTyxFQUFFLENBQUM7S0FDYjtBQUNMLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxPQUFlO0lBQy9CLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEtBQUssV0FBVyxFQUFFO1FBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdURBQXVELENBQUMsQ0FBQztRQUNyRSxPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QixPQUFPO0tBQ1I7SUFDRCxNQUFNLE9BQU8sR0FBRyxVQUFVLHVCQUFhLFNBQVMsb0JBQVUsRUFBRSxDQUFDO0lBQzdELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO0lBQzdDLE1BQU0sR0FBRyxHQUFHO1FBQ1IsUUFBUSxFQUFFLFFBQVEsRUFBRTtRQUNwQixPQUFPO1FBQ1AsU0FBUztRQUNULE9BQU87UUFDUCxXQUFXLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUU7S0FDL0MsQ0FBQztJQUNGLElBQUksSUFBWSxDQUFDO0lBQ2pCLElBQUk7UUFDQSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUM5QjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1YsR0FBRyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzlCO0lBRUQsS0FBSyxDQUFDLEdBQUcseUJBQWUsT0FBTyxFQUFFO1FBQzdCLE1BQU0sRUFBRSxNQUFNO1FBQ2QsSUFBSSxFQUFFLElBQUk7UUFDVixPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7S0FDbEQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFO0lBQzVDLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLFVBQVUsQ0FDUixHQUFHLFVBQVUsQ0FBQyxPQUFPLFlBQVksVUFBVSxDQUFDLE1BQU0sWUFBWSxVQUFVLENBQUMsS0FBSyxVQUFVLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ3JILENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxjQUFjLEdBQUc7SUFDbkIsS0FBSyxFQUFFLFVBQVMsT0FBZTtRQUMzQixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBQ0QsR0FBRyxFQUFFLFVBQVMsT0FBZTtRQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN4QixDQUFDO0NBRUosQ0FBQztBQUV5QixpQ0FBTyJ9