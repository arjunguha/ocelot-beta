"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_monaco_editor_1 = require("react-monaco-editor");
const react_resize_detector_1 = require("react-resize-detector");
const elemjsHighlighter_1 = require("./elemjsHighlighter");
const styles_1 = require("@material-ui/core/styles");
const Pets_1 = require("@material-ui/icons/Pets");
const Typography_1 = require("@material-ui/core/Typography");
const state = require("../../state");
const errors_1 = require("../../errors");
const reactrx_1 = require("../../reactrx");
const saveHistory_1 = require("../../utils/api/saveHistory");
const apiHelpers_1 = require("../../utils/api/apiHelpers");
const styles = theme => ({
    emptyState: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pawIcon: {
        fontSize: '8em',
        color: theme.palette.primary.contrastText,
        opacity: 0.4,
        marginBottom: '0.3em',
    }
});
const monacoOptions = {
    mouseWheelZoom: false,
    selectOnLineNumbers: true,
    fontSize: 14,
    fontFamily: 'Fira Mono',
    autoIndent: true,
    folding: false,
    minimap: {
        enabled: false,
    },
    renderIndentGuides: true,
    contextmenu: false
    // scrollBeyondLastLine: false,
};
class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.fontSize = 14;
        this.editorWillMount = (monaco) => {
            // monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            //     noLib: true,
            //     allowNonTsExtensions: true
            // });
            // monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            //     noSemanticValidation: true,
            //     noSyntaxValidation: false,
            // });
            monaco.languages.register({ id: 'elementaryjs' });
            monaco.languages.setMonarchTokensProvider('elementaryjs', elemjsHighlighter_1.default());
            monaco.languages.setLanguageConfiguration('elementaryjs', {
                comments: {
                    lineComment: '//',
                    blockComment: ['/*', '*/']
                },
                indentationRules: {
                    increaseIndentPattern: /^.*\{[^}\"']*$/,
                    decreaseIndentPattern: /^(.*\*\/)?\s*\}[;\s]*$/
                },
                brackets: [
                    ['{', '}'],
                    ['(', ')']
                ],
                autoClosingPairs: [],
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
            monaco.editor.defineTheme('sudoTheme', {
                base: 'vs-dark',
                inherit: true,
                rules: [],
                colors: {
                    ["editor.background"]: '#400000',
                }
            });
        };
        this.editorDidMount = (editor, monaco) => {
            editor.focus();
            editor.getModel().updateOptions({ tabSize: 2 });
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function () {
                // students can accidentally press ctrl/cmd + s, this prevents default action
            }, '');
            editor.addCommand(monaco.KeyCode.F1, () => { }, '');
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.UpArrow, () => {
                this.fontSize = Math.min(this.fontSize + 1, 40);
                editor.updateOptions({ fontSize: this.fontSize });
            }, '');
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.DownArrow, () => {
                this.fontSize = Math.max(this.fontSize - 1, 1);
                editor.updateOptions({ fontSize: this.fontSize });
            }, '');
            let codeEditor = this;
            let saveCode = function () {
                if (!state.uiActive.getValue()) {
                    return;
                }
                const program = state.currentProgram.getValue();
                if (program.kind !== 'program')
                    return;
                saveHistory_1.saveHistory(program.name, program.content).then((res) => {
                    if (apiHelpers_1.isFailureResponse(res)) {
                        state.notify('Failed to save history');
                        return;
                    }
                })
                    .catch(err => errors_1.console.log(err));
            };
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () {
                // Ctrl + Enter: Run code
                saveCode();
                codeEditor.props.sandbox.onRunOrTestClicked('running');
            }, '');
            editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, function () {
                // Ctrl + Shift + Enter: Run tests
                saveCode();
                codeEditor.props.sandbox.onRunOrTestClicked('testing');
            }, '');
            this.editor = editor;
        };
        this.handleResize = () => {
            if (typeof this.editor === 'undefined') {
                return;
            }
            this.editor.layout();
        };
        this.editor = undefined;
        this.state = {
            // On initialization, this will be nothing
            loadProgram: state.currentProgram.getValue()
        };
        reactrx_1.connect(this, 'loadProgram', state.loadProgram);
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.editor === undefined) {
            return;
        }
        state.currentProgram.next(this.state.loadProgram);
        this.editor.focus();
    }
    onChange(code) {
        if (this.state.loadProgram.kind !== 'program') {
            errors_1.console.error('editor received onChange without a loaded program');
            return;
        }
        state.currentProgram.next({
            kind: 'program',
            name: this.state.loadProgram.name,
            content: code
        });
        if (state.loggedIn.getValue().kind === 'logged-out') {
            return;
        }
        state.dirty.next('dirty');
    }
    ;
    render() {
        const { classes } = this.props;
        if (this.state.loadProgram.kind !== 'program') {
            return (React.createElement("div", { className: classes.emptyState },
                React.createElement(Pets_1.default, { className: classes.pawIcon }),
                React.createElement(Typography_1.default, { variant: "subheading", align: "center", style: { opacity: 0.4 } }, "Select/Create a file to get started")));
        }
        return (React.createElement("div", { style: { height: '100%', width: '100%' } },
            React.createElement(react_resize_detector_1.default, { handleWidth: true, handleHeight: true, onResize: this.handleResize }),
            React.createElement(react_monaco_editor_1.default, { language: "elementaryjs", theme: "vs-dark" // Change to sudoTheme when state.isSudo is true.
                , value: this.state.loadProgram.content, options: monacoOptions, onChange: (code) => this.onChange(code), editorDidMount: this.editorDidMount, editorWillMount: this.editorWillMount })));
    }
}
exports.default = styles_1.withStyles(styles)(CodeEditor);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29udGFpbmVycy9Db2RlRWRpdG9yL2luZGV4LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUErQjtBQUMvQiw2REFBK0M7QUFFL0MsaUVBQXdEO0FBQ3hELDJEQUFrRDtBQUNsRCxxREFBc0Y7QUFDdEYsa0RBQThDO0FBQzlDLDZEQUFzRDtBQUN0RCxxQ0FBcUM7QUFDckMseUNBQXVDO0FBQ3ZDLDJDQUF3QztBQUV4Qyw2REFBeUQ7QUFDekQsMkRBQStEO0FBRS9ELE1BQU0sTUFBTSxHQUF1QixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekMsVUFBVSxFQUFFO1FBQ1IsS0FBSyxFQUFFLE1BQU07UUFDYixNQUFNLEVBQUUsTUFBTTtRQUNkLE9BQU8sRUFBRSxNQUFNO1FBQ2YsYUFBYSxFQUFFLFFBQVE7UUFDdkIsVUFBVSxFQUFFLFFBQVE7UUFDcEIsY0FBYyxFQUFFLFFBQVE7S0FDM0I7SUFDRCxPQUFPLEVBQUU7UUFDTCxRQUFRLEVBQUUsS0FBSztRQUNmLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZO1FBQ3pDLE9BQU8sRUFBRSxHQUFHO1FBQ1osWUFBWSxFQUFFLE9BQU87S0FDeEI7Q0FDSixDQUFDLENBQUM7QUFFSCxNQUFNLGFBQWEsR0FBbUQ7SUFDbEUsY0FBYyxFQUFFLEtBQUs7SUFDckIsbUJBQW1CLEVBQUUsSUFBSTtJQUN6QixRQUFRLEVBQUUsRUFBRTtJQUNaLFVBQVUsRUFBRSxXQUFXO0lBQ3ZCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSxLQUFLO0lBQ2QsT0FBTyxFQUFFO1FBQ0wsT0FBTyxFQUFFLEtBQUs7S0FDakI7SUFDRCxrQkFBa0IsRUFBRSxJQUFJO0lBQ3hCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLCtCQUErQjtDQUNsQyxDQUFDO0FBV0YsTUFBTSxVQUFXLFNBQVEsS0FBSyxDQUFDLFNBQWlDO0lBSTVELFlBQVksS0FBWTtRQUNwQixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFIakIsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQVl0QixvQkFBZSxHQUFHLENBQUMsTUFBMkIsRUFBRSxFQUFFO1lBQzlDLHNFQUFzRTtZQUN0RSxtQkFBbUI7WUFDbkIsaUNBQWlDO1lBQ2pDLE1BQU07WUFDTix5RUFBeUU7WUFDekUsa0NBQWtDO1lBQ2xDLGlDQUFpQztZQUNqQyxNQUFNO1lBQ04sTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUNsRCxNQUFNLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLGNBQWMsRUFBRSwyQkFBZSxFQUFFLENBQUMsQ0FBQztZQUM3RSxNQUFNLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDLGNBQWMsRUFBRTtnQkFDdEQsUUFBUSxFQUFFO29CQUNOLFdBQVcsRUFBRSxJQUFJO29CQUNqQixZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO2lCQUM3QjtnQkFDRCxnQkFBZ0IsRUFBRTtvQkFDZCxxQkFBcUIsRUFBRSxnQkFBZ0I7b0JBQ3ZDLHFCQUFxQixFQUFFLHdCQUF3QjtpQkFDbEQ7Z0JBQ0QsUUFBUSxFQUFFO29CQUNOLENBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQztvQkFDVCxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7aUJBQ2I7Z0JBQ0QsZ0JBQWdCLEVBQUUsRUFBRTthQUN2QixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsU0FBUyxDQUFDLDhCQUE4QixDQUFDLGNBQWMsRUFBRTtnQkFDNUQsaUVBQWlFO2dCQUNqRSxnRUFBZ0U7Z0JBQ2hFLGlFQUFpRTtnQkFDakUsc0JBQXNCLENBQUMsS0FBSyxFQUFFLFFBQVE7b0JBQ2xDLE9BQU8sQ0FBQzs0QkFDSixLQUFLLEVBQUUsRUFBRTs0QkFDVCxJQUFJLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJO3lCQUNqRCxDQUFDLENBQUM7Z0JBQ1AsQ0FBQzthQUNKLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRTtnQkFDbkMsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsTUFBTSxFQUFFO29CQUNKLENBQUMsbUJBQW1CLENBQUMsRUFBRSxTQUFTO2lCQUNuQzthQUN3QyxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDO1FBRUYsbUJBQWMsR0FBRyxDQUFDLE1BQWlELEVBQUUsTUFBMkIsRUFBRSxFQUFFO1lBQ2hHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNmLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO2dCQUM1RCw2RUFBNkU7WUFDakYsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1AsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFbkQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ25FLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQTtZQUNwRCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFUCxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtnQkFDckUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUMsQ0FBQyxDQUFBO1lBQ3BELENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVQLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJLFFBQVEsR0FBRztnQkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFDNUIsT0FBTztpQkFDVjtnQkFDRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNoRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssU0FBUztvQkFBRSxPQUFPO2dCQUN2Qyx5QkFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUNwRCxJQUFJLDhCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUMxQixLQUFLLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUM7d0JBQ3ZDLE9BQU87cUJBQ1I7Z0JBQ0gsQ0FBQyxDQUFDO3FCQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGdCQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdEMsQ0FBQyxDQUFBO1lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtnQkFDNUQseUJBQXlCO2dCQUN6QixRQUFRLEVBQUUsQ0FBQztnQkFDWCxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMzRCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDUCxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO2dCQUNsRixrQ0FBa0M7Z0JBQ2xDLFFBQVEsRUFBRSxDQUFDO2dCQUNYLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNELENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNQLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3pCLENBQUMsQ0FBQTtRQVVELGlCQUFZLEdBQUcsR0FBRyxFQUFFO1lBQ2hCLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFdBQVcsRUFBRTtnQkFDcEMsT0FBTzthQUNWO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN6QixDQUFDLENBQUE7UUFsSEcsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7UUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRztZQUNULDBDQUEwQztZQUMxQyxXQUFXLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUU7U0FDL0MsQ0FBQztRQUNGLGlCQUFPLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQStGRCxrQkFBa0IsQ0FBQyxTQUFnQixFQUFFLFNBQTBCO1FBQzNELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDM0IsT0FBTztTQUNWO1FBQ0QsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFTRCxRQUFRLENBQUMsSUFBWTtRQUNqQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDM0MsZ0JBQU8sQ0FBQyxLQUFLLENBQUMsbURBQW1ELENBQUMsQ0FBQztZQUNuRSxPQUFPO1NBQ1Y7UUFDRCxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQztZQUN0QixJQUFJLEVBQUUsU0FBUztZQUNmLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJO1lBQ2pDLE9BQU8sRUFBRSxJQUFJO1NBQ2hCLENBQUMsQ0FBQztRQUNILElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFFO1lBQ2pELE9BQU87U0FDVjtRQUNELEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFBQSxDQUFDO0lBRUYsTUFBTTtRQUNGLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRS9CLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUMzQyxPQUFPLENBQ0gsNkJBQUssU0FBUyxFQUFFLE9BQU8sQ0FBQyxVQUFVO2dCQUM5QixvQkFBQyxjQUFPLElBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEdBQUk7Z0JBQ3ZDLG9CQUFDLG9CQUFVLElBQUMsT0FBTyxFQUFDLFlBQVksRUFBQyxLQUFLLEVBQUMsUUFBUSxFQUFDLEtBQUssRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUMsMENBRXhELENBQ1gsQ0FDVCxDQUFDO1NBQ0w7UUFHRCxPQUFPLENBQ0gsNkJBQUssS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3pDLG9CQUFDLCtCQUFtQixJQUFDLFdBQVcsUUFBQyxZQUFZLFFBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxZQUFZLEdBQUk7WUFDN0Usb0JBQUMsNkJBQVksSUFDVCxRQUFRLEVBQUMsY0FBYyxFQUN2QixLQUFLLEVBQUMsU0FBUyxDQUFDLGlEQUFpRDtrQkFDakUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFDckMsT0FBTyxFQUFFLGFBQWEsRUFDdEIsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUN2QyxjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFDbkMsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlLEdBQ3ZDLENBQ0MsQ0FDVixDQUFDO0lBQ04sQ0FBQztDQUNKO0FBRUQsa0JBQWUsbUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyJ9