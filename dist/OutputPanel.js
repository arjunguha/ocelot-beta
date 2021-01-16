"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styles_1 = require("@material-ui/core/styles");
require("static/styles/ConsoleTabs.css");
const react_monaco_editor_1 = require("react-monaco-editor");
const KeyboardArrowRight_1 = require("@material-ui/icons/KeyboardArrowRight");
const console_feed_1 = require("console-feed");
const consoleStyle_1 = require("./static/styles/consoleStyle");
require("static/styles/Scrollbar.css");
const stringifyObject = require('./stringifyObject');
class ConsoleOutput extends React.Component {
    constructor() {
        super(...arguments);
        this.logRef = null;
    }
    componentDidUpdate() {
        if (this.logRef !== null) {
            this.logRef.scrollTop = this.logRef.scrollHeight;
        }
    }
    render() {
        const { logs } = this.props;
        return (React.createElement("div", { className: "scrollbars", style: {
                backgroundColor: '#242424',
                overflowY: 'auto',
                overflowX: 'hidden',
                flexGrow: 1
            }, ref: (divElem) => this.logRef = divElem },
            React.createElement(console_feed_1.Console, { logs: logs, variant: "dark", styles: consoleStyle_1.inspectorTheme })));
    }
}
const lineHeight = 22; // pixels
const maxHeight = 126;
const monacoOptions = {
    wordWrap: 'on',
    overviewRulerLanes: 0,
    glyphMargin: false,
    lineNumbers: 'off',
    folding: false,
    selectOnLineNumbers: false,
    selectionHighlight: false,
    // cursorStyle: 'line-thin',
    scrollbar: {
        useShadows: false,
        horizontal: 'hidden',
        verticalScrollbarSize: 9,
    },
    lineDecorationsWidth: 0,
    scrollBeyondLastLine: false,
    renderLineHighlight: 'none',
    minimap: {
        enabled: false,
    },
    contextmenu: false,
    ariaLabel: 'ConsoleInput',
    fontFamily: 'Fira Mono',
    fontSize: 16,
    autoClosingBrackets: false,
};
const s1 = {
    width: '100%',
    padding: '8px',
    display: 'flex',
    flexShrink: 0,
    backgroundColor: '#1e1e1e'
};
const styles = theme => ({
    root: {
        borderTop: '1px solid white',
        flexGrow: 1,
        backgroundColor: theme.palette.primary.light,
        height: '100%',
        width: '100%'
    },
});
class OutputPanel extends React.Component {
    constructor(props) {
        super(props);
        this.editor = undefined;
        this.command = (command, result, isError) => {
            this.appendLogMessage({ method: 'command', data: [command] });
            if (isError) {
                this.error(result);
            }
            else {
                this.log(result);
            }
        };
        this.editorDidMount = (editor, monaco) => {
            this.editor = editor;
            window.addEventListener('resize', this.resizeEditor);
            let currentLineCount = 1;
            editor.onDidChangeModelContent(() => {
                const totalLineCount = editor.getModel().getLineCount();
                if (totalLineCount !== currentLineCount) {
                    this.setState({
                        editorHeight: Math.min(maxHeight, totalLineCount * lineHeight)
                    });
                    editor.layout();
                    currentLineCount = totalLineCount;
                }
            });
            const retrieveHistory = (event, isDownkey) => {
                event.preventDefault();
                event.stopPropagation();
                if (!isDownkey && this.state.historyLocation + 1 > this.state.commandHistory.length - 1) { // if at the top of history
                    return;
                }
                let newHistoryLocation = Math.min(this.state.historyLocation + 1, this.state.commandHistory.length - 1);
                if (isDownkey) {
                    newHistoryLocation = Math.max(this.state.historyLocation - 1, -1);
                }
                editor.setValue(this.state.commandHistory[newHistoryLocation] || '');
                const newLineCount = editor.getModel().getLineCount();
                const newColumn = editor.getModel().getLineMaxColumn(newLineCount);
                editor.setPosition({ lineNumber: newLineCount, column: newColumn });
                this.setState({ historyLocation: newHistoryLocation });
            };
            editor.onKeyDown(event => {
                const currentCursorLineNum = editor.getPosition().lineNumber;
                const totalNumLines = editor.getModel().getLineCount();
                if (event.keyCode === monaco.KeyCode.UpArrow && currentCursorLineNum === 1) { // if topmost line
                    retrieveHistory(event, false);
                    return;
                }
                if (event.keyCode === monaco.KeyCode.DownArrow && currentCursorLineNum === totalNumLines) { // if last line
                    retrieveHistory(event, true);
                    return;
                }
                if (event.keyCode === monaco.KeyCode.Enter && event.shiftKey) {
                    return;
                }
                if (event.keyCode === monaco.KeyCode.Enter && !event.shiftKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (this.props.sandbox.mode.getValue() !== 'stopped') {
                        window.console.log('Ignoring console command, program running');
                        return;
                    }
                    const command = editor.getValue();
                    if (command.trim() === '') {
                        return;
                    }
                    editor.setValue('');
                    this.setState({
                        historyLocation: -1,
                        commandHistory: [command, ...this.state.commandHistory]
                    });
                    this.props.sandbox.onConsoleInput(command);
                }
            });
        };
        this.resizeEditor = () => {
            if (this.editor !== undefined) {
                this.editor.layout();
            }
        };
        this.editorWillMount = (monaco) => {
            monaco.languages.register({ id: 'elementaryjs' });
            monaco.languages.setLanguageConfiguration('elementaryjs', {
                comments: {
                    lineComment: '//',
                    blockComment: ['/*', '*/']
                },
                indentationRules: {
                    increaseIndentPattern: /^.*\{[^}\"']*$/,
                    decreaseIndentPattern: /^(.*\*\/)?\s*\}[;\s]*$/
                },
            });
            monaco.languages.registerCompletionItemProvider('elementaryjs', {
                // A hacky way to get rid of autocomplete suggestions completely.
                // returning an empty array will not 'override' the autocomplete
                // but giving my own autocomplete items can override it it seems.
                provideCompletionItems(model, position) {
                    return [{
                            label: '',
                            kind: monaco.languages.CompletionItemKind.Text
                        }];
                }
            });
        };
        this.state = {
            logs: [],
            commandHistory: [],
            historyLocation: -1,
            editorHeight: lineHeight,
        };
    }
    error(message) {
        this.appendLogMessage({
            method: 'log',
            data: [
                `%c${message}`,
                'color: #ff0000; font-weight: bold'
            ]
        });
    }
    log(...message) {
        for (let i = 0; i < message.length; ++i) {
            if (typeof (message[i]) === 'object') {
                const stringRep = stringifyObject(message[i], {
                    indent: '  ',
                    singleQuotes: false,
                    inlineCharacterLimit: 12,
                    transform: (obj, prop, originalResult) => {
                        if (Array.isArray(obj[prop]) && obj[prop].length > 30) {
                            let splitArray = originalResult.split('\n');
                            let indent = splitArray[splitArray.length - 1].match(/\S/).index;
                            return splitArray.slice(0, 4).concat([' '.repeat(indent) + `${splitArray.length - 2 - 3} more...`, splitArray[splitArray.length - 1]]).join('\n');
                        }
                        return originalResult;
                    }
                });
                message[i] = stringRep;
            }
        }
        this.appendLogMessage({ method: 'log', data: message });
    }
    /** Appends a message to the log. Bounds scrollback to 100 items. */
    appendLogMessage(message) {
        this.setState((prevState) => {
            let newLog = [...prevState.logs, message];
            if (newLog.length > 100) {
                newLog = newLog.slice(newLog.length - 100);
            }
            return { logs: newLog };
        });
    }
    componentDidMount() {
        this.props.sandbox.setConsole(this);
        this.props.aref(this);
    }
    echo(command) {
        this.appendLogMessage({ method: 'command', data: [command] });
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeEditor);
    }
    render() {
        const { classes, } = this.props;
        return (React.createElement("div", { className: classes.root, id: "outputPanel" },
            React.createElement("div", { style: {
                    height: '100%',
                    flexDirection: 'column',
                    display: 'flex'
                } },
                React.createElement(ConsoleOutput, { logs: this.state.logs }),
                React.createElement("div", { style: s1 },
                    React.createElement("div", { style: { color: 'white', height: '24px' } },
                        React.createElement(KeyboardArrowRight_1.default, { color: "inherit" })),
                    React.createElement("div", { style: { verticalAlign: 'middle', width: '100%', height: `${this.state.editorHeight}px` } },
                        React.createElement(react_monaco_editor_1.default, { theme: "vs-dark", language: "elementaryjs", options: monacoOptions, editorDidMount: this.editorDidMount, editorWillMount: this.editorWillMount }))))));
    }
}
exports.default = styles_1.withStyles(styles)(OutputPanel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3V0cHV0UGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvT3V0cHV0UGFuZWwudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQStCO0FBQy9CLHFEQUFzRjtBQUN0Rix5Q0FBdUM7QUFHdkMsNkRBQStDO0FBRS9DLDhFQUFtRTtBQUVuRSwrQ0FBdUM7QUFDdkMsK0RBQThEO0FBQzlELHVDQUFxQztBQUVyQyxNQUFNLGVBQWUsR0FBUSxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUUxRCxNQUFNLGFBQWMsU0FBUSxLQUFLLENBQUMsU0FBa0M7SUFBcEU7O1FBQ0ksV0FBTSxHQUEwQixJQUFJLENBQUM7SUF5QnpDLENBQUM7SUF2Qkcsa0JBQWtCO1FBQ2QsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtZQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQztTQUNwRDtJQUNMLENBQUM7SUFFRCxNQUFNO1FBQ0YsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFNUIsT0FBTyxDQUNILDZCQUFLLFNBQVMsRUFBQyxZQUFZLEVBQ3ZCLEtBQUssRUFBRTtnQkFDSCxlQUFlLEVBQUUsU0FBUztnQkFDMUIsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixRQUFRLEVBQUUsQ0FBQzthQUNkLEVBQ0QsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU87WUFDdkMsb0JBQUMsc0JBQU8sSUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFFLDZCQUFjLEdBQUksQ0FDNUQsQ0FDVCxDQUFDO0lBQ04sQ0FBQztDQUVKO0FBRUQsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUMsU0FBUztBQUNoQyxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFFdEIsTUFBTSxhQUFhLEdBQW1EO0lBQ2xFLFFBQVEsRUFBRSxJQUFJO0lBQ2Qsa0JBQWtCLEVBQUUsQ0FBQztJQUNyQixXQUFXLEVBQUUsS0FBSztJQUNsQixXQUFXLEVBQUUsS0FBSztJQUNsQixPQUFPLEVBQUUsS0FBSztJQUNkLG1CQUFtQixFQUFFLEtBQUs7SUFDMUIsa0JBQWtCLEVBQUUsS0FBSztJQUN6Qiw0QkFBNEI7SUFDNUIsU0FBUyxFQUFFO1FBQ1AsVUFBVSxFQUFFLEtBQUs7UUFDakIsVUFBVSxFQUFFLFFBQVE7UUFDcEIscUJBQXFCLEVBQUUsQ0FBQztLQUMzQjtJQUNELG9CQUFvQixFQUFFLENBQUM7SUFDdkIsb0JBQW9CLEVBQUUsS0FBSztJQUMzQixtQkFBbUIsRUFBRSxNQUFNO0lBQzNCLE9BQU8sRUFBRTtRQUNMLE9BQU8sRUFBRSxLQUFLO0tBQ2pCO0lBQ0QsV0FBVyxFQUFFLEtBQUs7SUFDbEIsU0FBUyxFQUFFLGNBQWM7SUFDekIsVUFBVSxFQUFFLFdBQVc7SUFDdkIsUUFBUSxFQUFFLEVBQUU7SUFDWixtQkFBbUIsRUFBRSxLQUFLO0NBQzdCLENBQUM7QUFFRixNQUFNLEVBQUUsR0FBRztJQUNQLEtBQUssRUFBRSxNQUFNO0lBQ2IsT0FBTyxFQUFFLEtBQUs7SUFDZCxPQUFPLEVBQUUsTUFBTTtJQUNmLFVBQVUsRUFBRSxDQUFDO0lBQ2IsZUFBZSxFQUFFLFNBQVM7Q0FDN0IsQ0FBQztBQUVGLE1BQU0sTUFBTSxHQUF1QixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekMsSUFBSSxFQUFFO1FBQ0YsU0FBUyxFQUFFLGlCQUFpQjtRQUM1QixRQUFRLEVBQUUsQ0FBQztRQUNYLGVBQWUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLO1FBQzVDLE1BQU0sRUFBRSxNQUFNO1FBQ2QsS0FBSyxFQUFFLE1BQU07S0FDaEI7Q0FDSixDQUFDLENBQUM7QUFlSCxNQUFNLFdBQVksU0FBUSxLQUFLLENBQUMsU0FBdUI7SUFJbkQsWUFBWSxLQUFZO1FBQ3BCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUhqQixXQUFNLEdBQTBELFNBQVMsQ0FBQztRQWtFMUUsWUFBTyxHQUFHLENBQUMsT0FBZSxFQUFFLE1BQVcsRUFBRSxPQUFnQixFQUFFLEVBQUU7WUFDekQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDOUQsSUFBSSxPQUFPLEVBQUU7Z0JBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN0QjtpQkFDSTtnQkFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3BCO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsbUJBQWMsR0FBRyxDQUFDLE1BQWlELEVBQUUsTUFBMkIsRUFBRSxFQUFFO1lBQ2hHLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3JELElBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2hDLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDeEQsSUFBSSxjQUFjLEtBQUssZ0JBQWdCLEVBQUU7b0JBQ3JDLElBQUksQ0FBQyxRQUFRLENBQUM7d0JBQ1YsWUFBWSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQWMsR0FBRyxVQUFVLENBQUM7cUJBQ2pFLENBQUMsQ0FBQztvQkFDSCxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2hCLGdCQUFnQixHQUFHLGNBQWMsQ0FBQztpQkFDckM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sZUFBZSxHQUFHLENBQUMsS0FBa0MsRUFBRSxTQUFrQixFQUFFLEVBQUU7Z0JBQy9FLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUUsMkJBQTJCO29CQUNsSCxPQUFPO2lCQUNWO2dCQUNELElBQUksa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN4RyxJQUFJLFNBQVMsRUFBRTtvQkFDWCxrQkFBa0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNyRTtnQkFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ3JFLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDdEQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFBO2dCQUNsRSxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztnQkFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxDQUFDLENBQUM7WUFFM0QsQ0FBQyxDQUFDO1lBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDckIsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUM3RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3ZELElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxvQkFBb0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxrQkFBa0I7b0JBQzVGLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzlCLE9BQU87aUJBQ1Y7Z0JBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxJQUFJLG9CQUFvQixLQUFLLGFBQWEsRUFBRSxFQUFFLGVBQWU7b0JBQ3ZHLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzdCLE9BQU87aUJBQ1Y7Z0JBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7b0JBQzFELE9BQU87aUJBQ1Y7Z0JBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtvQkFDM0QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQ3hCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLFNBQVMsRUFBRTt3QkFDcEQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkNBQTJDLENBQUMsQ0FBQzt3QkFDaEUsT0FBTztxQkFDUjtvQkFDRCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ2xDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTt3QkFDdkIsT0FBTztxQkFDVjtvQkFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDO3dCQUNWLGVBQWUsRUFBRSxDQUFDLENBQUM7d0JBQ25CLGNBQWMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO3FCQUMxRCxDQUFDLENBQUM7b0JBQ0gsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUM5QztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFBO1FBRUQsaUJBQVksR0FBRyxHQUFHLEVBQUU7WUFDaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUN4QjtRQUNMLENBQUMsQ0FBQTtRQU1ELG9CQUFlLEdBQUcsQ0FBQyxNQUEyQixFQUFFLEVBQUU7WUFDOUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUNsRCxNQUFNLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLGNBQWMsRUFBRTtnQkFDdEQsUUFBUSxFQUFFO29CQUNOLFdBQVcsRUFBRSxJQUFJO29CQUNqQixZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2lCQUM3QjtnQkFDRCxnQkFBZ0IsRUFBRTtvQkFDZCxxQkFBcUIsRUFBRSxnQkFBZ0I7b0JBQ3ZDLHFCQUFxQixFQUFFLHdCQUF3QjtpQkFDbEQ7YUFDSixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDLDhCQUE4QixDQUFDLGNBQWMsRUFBRTtnQkFDNUQsaUVBQWlFO2dCQUNqRSxnRUFBZ0U7Z0JBQ2hFLGlFQUFpRTtnQkFDakUsc0JBQXNCLENBQUMsS0FBSyxFQUFFLFFBQVE7b0JBQ2xDLE9BQU8sQ0FBQzs0QkFDSixLQUFLLEVBQUUsRUFBRTs0QkFDVCxJQUFJLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJO3lCQUNqRCxDQUFDLENBQUM7Z0JBQ1AsQ0FBQzthQUNKLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztRQTdLRSxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1QsSUFBSSxFQUFFLEVBQUU7WUFDUixjQUFjLEVBQUUsRUFBRTtZQUNsQixlQUFlLEVBQUUsQ0FBQyxDQUFDO1lBQ25CLFlBQVksRUFBRSxVQUFVO1NBQzNCLENBQUM7SUFDTixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQWU7UUFDakIsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQ2xCLE1BQU0sRUFBRSxLQUFLO1lBQ2QsSUFBSSxFQUFFO2dCQUNKLEtBQUssT0FBTyxFQUFFO2dCQUNmLG1DQUFtQzthQUNuQztTQUNILENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxHQUFHLENBQUMsR0FBRyxPQUFjO1FBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3JDLElBQUksT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDakMsTUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDMUMsTUFBTSxFQUFFLElBQUk7b0JBQ1osWUFBWSxFQUFFLEtBQUs7b0JBQ25CLG9CQUFvQixFQUFFLEVBQUU7b0JBQ3hCLFNBQVMsRUFBRSxDQUFDLEdBQVEsRUFBRSxJQUFTLEVBQUUsY0FBc0IsRUFBVyxFQUFFO3dCQUNoRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7NEJBQ25ELElBQUksVUFBVSxHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQzVDLElBQUksTUFBTSxHQUFLLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQXNCLENBQUMsS0FBZ0IsQ0FBQzs0QkFDbkcsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQ2hDLENBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFFLENBQ3JHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3lCQUNoQjt3QkFDRCxPQUFPLGNBQWMsQ0FBQTtvQkFDekIsQ0FBQztpQkFDSixDQUFDLENBQUM7Z0JBQ0gsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQzthQUMxQjtTQUNKO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsb0VBQW9FO0lBQ3BFLGdCQUFnQixDQUFDLE9BQXdFO1FBQ3JGLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtZQUN4QixJQUFJLE1BQU0sR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFrQixDQUFDLENBQUM7WUFDckQsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtnQkFDckIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQzthQUM5QztZQUNELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLENBQUMsT0FBZTtRQUNoQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBc0ZELG9CQUFvQjtRQUNoQixNQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBMkJELE1BQU07UUFDRixNQUFNLEVBQUUsT0FBTyxHQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNqQyxPQUFPLENBQ0gsNkJBQUssU0FBUyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFDLGFBQWE7WUFDMUMsNkJBQUssS0FBSyxFQUFFO29CQUNSLE1BQU0sRUFBRSxNQUFNO29CQUNkLGFBQWEsRUFBRSxRQUFRO29CQUN2QixPQUFPLEVBQUUsTUFBTTtpQkFDbEI7Z0JBQ0csb0JBQUMsYUFBYSxJQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQXFCLEdBQUk7Z0JBQ3pELDZCQUFLLEtBQUssRUFBRSxFQUFFO29CQUNWLDZCQUFLLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTt3QkFDMUMsb0JBQUMsNEJBQWMsSUFBQyxLQUFLLEVBQUMsU0FBUyxHQUFHLENBQ2hDO29CQUNOLDZCQUFLLEtBQUssRUFBRSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxFQUFFO3dCQUMxRixvQkFBQyw2QkFBWSxJQUNULEtBQUssRUFBQyxTQUFTLEVBQ2YsUUFBUSxFQUFDLGNBQWMsRUFDdkIsT0FBTyxFQUFFLGFBQWEsRUFDdEIsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQ25DLGVBQWUsRUFBRSxJQUFJLENBQUMsZUFBZSxHQUN2QyxDQUNBLENBQ0osQ0FFSixDQUNKLENBQ1QsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQUVELGtCQUFlLG1CQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMifQ==