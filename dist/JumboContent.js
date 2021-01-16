"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JumboContentDefault = void 0;
const React = require("react");
const react_split_pane_1 = require("react-split-pane");
const CanvasOutput_1 = require("./components/CanvasOutput");
const OutputPanel_1 = require("./OutputPanel");
require("./static/styles/SplitPane.css");
const red_1 = require("@material-ui/core/colors/red");
const styles_1 = require("@material-ui/core/styles");
const PlayArrow_1 = require("@material-ui/icons/PlayArrow");
const CodeEditor_1 = require("./containers/CodeEditor");
const Spellcheck_1 = require("@material-ui/icons/Spellcheck");
const Button_1 = require("@material-ui/core/Button");
const Stop_1 = require("@material-ui/icons/Stop");
const ArrowDownward_1 = require("@material-ui/icons/ArrowDownward");
const saveHistory_1 = require("./utils/api/saveHistory");
const apiHelpers_1 = require("./utils/api/apiHelpers");
const SideDrawer_1 = require("./SideDrawer");
const offlineIndicator_1 = require("./offlineIndicator");
const Notification_1 = require("./containers/Notification");
const sandbox = require("./sandbox");
const loginButton_1 = require("./loginButton");
const HistoryButton_1 = require("./containers/HistoryButton");
const state = require("./state");
const reactrx = require("./reactrx");
require("./autosave");
const errors_1 = require("./errors");
// import { withStyles, WithStyles, StyleRulesCallback } from '@material-ui/core/styles';
const AppBar_1 = require("@material-ui/core/AppBar");
const Toolbar_1 = require("@material-ui/core/Toolbar");
const FileCopy_1 = require("@material-ui/icons/FileCopy");
const Wallpaper_1 = require("@material-ui/icons/Wallpaper");
const NavigateNext_1 = require("@material-ui/icons/NavigateNext");
const Dialog_1 = require("@material-ui/core/Dialog");
const DialogActions_1 = require("@material-ui/core/DialogActions");
const DialogContent_1 = require("@material-ui/core/DialogContent");
const DialogContentText_1 = require("@material-ui/core/DialogContentText");
const DialogTitle_1 = require("@material-ui/core/DialogTitle");
window.globalState = state;
const classes = {
    flex: {
        flex: '1',
    },
    icon: {
        marginBottom: '0.25em',
        marginRight: '1.5',
    },
    title: {
        fontFamily: 'Fira Mono, Roboto, Arial, sans-serif',
        fontWeight: '400',
    },
};
const redTheme = styles_1.createMuiTheme({
    palette: {
        type: 'dark',
        primary: red_1.default,
    },
    overrides: {
        MuiButton: {
            root: {
                paddingLeft: '8px',
                paddingRight: '8px',
                minWidth: '0px',
            }
        }
    }
});
class ExecutionButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: this.props.sandbox.mode.getValue(),
            currentProgram: state.currentProgram.getValue()
        };
        reactrx.connect(this, 'mode', this.props.sandbox.mode);
        reactrx.connect(this, 'currentProgram', state.currentProgram);
    }
    onRunOrTestClicked(mode) {
        const program = state.currentProgram.getValue();
        if (state.uiActive.getValue() && program.kind === 'program') {
            saveHistory_1.saveHistory(program.name, program.content).then((res) => {
                if (apiHelpers_1.isFailureResponse(res)) {
                    // Suppress the notification if the browser is offline. Note that
                    // we still try to save, even when the UA thinks we are offline.
                    // I am not certain that online/offline detection is particularly
                    // reliable, so it is not worth disabling saving when offline.
                    if (navigator.onLine === false) {
                        return;
                    }
                    state.notify('Failed to save history');
                    return;
                }
            })
                .catch(err => errors_1.console.log(err));
        }
        this.props.sandbox.onRunOrTestClicked(mode);
    }
    render() {
        const { currentProgram, mode } = this.state;
        const mayRun = currentProgram.kind === 'program' && mode === 'stopped';
        const mayStop = (mode === 'running' || mode === 'testing');
        return [
            React.createElement(Button_1.default, { key: "run-button", color: "secondary", onClick: () => this.onRunOrTestClicked('running'), disabled: !mayRun },
                React.createElement(PlayArrow_1.default, { color: "inherit" }),
                React.createElement("span", { id: "toolbar-buttons-text" }, "Run")),
            React.createElement(Button_1.default, { key: "test-button", color: "secondary", onClick: () => this.onRunOrTestClicked('testing'), disabled: !mayRun },
                React.createElement(Spellcheck_1.default, { color: "inherit" }),
                React.createElement("span", { id: "toolbar-buttons-text" }, "Test")),
            React.createElement(styles_1.MuiThemeProvider, { key: "stop-button", theme: redTheme },
                React.createElement(Button_1.default, { color: "primary", onClick: () => this.props.sandbox.onStopClicked(), disabled: !mayStop },
                    React.createElement(Stop_1.default, { color: "inherit" }),
                    React.createElement("span", { id: "toolbar-buttons-text" }, "Stop")))
        ];
    }
}
const MustLoginDialog = ({ open, onClose }) => (React.createElement(Dialog_1.default, { open: open, onClose: onClose, "aria-labelledby": "must-login", "aria-describedby": "user must login to use editor" },
    React.createElement(DialogTitle_1.default, { id: "must-login" }, "Login required"),
    React.createElement(DialogContent_1.default, null,
        React.createElement(DialogContentText_1.default, { id: "alert-dialog-description" }, "Login is required and files need to be fully loaded to use Ocelot.")),
    React.createElement(DialogActions_1.default, null,
        React.createElement(Button_1.default, { onClick: onClose, color: "secondary" }, "Close"))));
class DownloadButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentProgram: state.currentProgram.getValue() };
        reactrx.connect(this, 'currentProgram', state.currentProgram);
    }
    onDownload() {
        const p = state.currentProgram.getValue();
        if (p.kind !== 'program') {
            return;
        }
        let element = document.createElement("a");
        let file = new Blob([p.content], { type: 'application/javascript' });
        element.href = URL.createObjectURL(file);
        element.download = p.name;
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    render() {
        return React.createElement(Button_1.default, { color: "secondary", disabled: this.state.currentProgram.kind !== 'program', onClick: () => this.onDownload() },
            React.createElement(ArrowDownward_1.default, null),
            React.createElement("span", { id: "toolbar-buttons-text" }, "Download"));
    }
}
class JumboContent extends React.Component {
    constructor(props) {
        super(props);
        this.togglePanel = (elementId, styleProperty, defaultSize, // if default size is number, it'll be in pixel
        closedSize) => {
            let element = document.getElementById(elementId);
            if (element === null) {
                return;
            }
            const numberRegx = /(\d*\.)?\d+/;
            if (typeof defaultSize === 'string' && !numberRegx.test(defaultSize)) {
                return;
            }
            if (typeof closedSize === 'string' && !numberRegx.test(closedSize)) {
                return;
            }
            let parent = element.parentElement; // assuming element must have parent
            closedSize = typeof closedSize === 'number' ? `${closedSize}px` : closedSize;
            let currentStyle = parent.getAttribute('style');
            if (currentStyle === null) {
                parent.setAttribute('style', `${styleProperty}: ${closedSize};`);
                return;
            }
            const stylePropRegx = new RegExp(`(m(?:in|ax)-)?${styleProperty}\\s*:\\s*\\d+(?:\\.\\d*)?[a-zA-Z%]+;?`, 'g');
            let matches = [], matcher;
            matcher = stylePropRegx.exec(currentStyle);
            while (matcher !== null) { // negative lookbehind alternative
                if (!matcher[1]) {
                    matches.push(matcher[0]);
                }
                matcher = stylePropRegx.exec(currentStyle);
            }
            if (matches.length <= 0) { // if no width/height is set
                parent.style[styleProperty] = closedSize;
                return;
            }
            const container = parent.parentElement; // panel must have a parent, SplitPane
            const containerLength = styleProperty === 'width' ? container.clientWidth : container.clientHeight;
            const latestPropertyVal = styleProperty === 'width' ? parent.clientWidth : parent.clientHeight;
            let closedSizeVal = Number(closedSize.match(numberRegx)[0]);
            if (closedSize.includes('%')) {
                closedSizeVal = (closedSizeVal / 100) * containerLength;
            }
            const isTiny = Math.abs(latestPropertyVal - closedSizeVal) < 30; // will not with cmp % and px
            if (isTiny && matches.length === 1) { // if tiny width/height set by user
                defaultSize = typeof defaultSize === 'number' ? `${defaultSize}px` : defaultSize;
                parent.style[styleProperty] = defaultSize; // toggle back to default
                return;
            }
            if (isTiny && matches.length > 1) {
                // remove latest width/height
                let currIndex = -1;
                parent.setAttribute('style', currentStyle.replace(stylePropRegx, (match, groupOne) => {
                    if (typeof groupOne === 'undefined') { // if matched
                        currIndex += 1;
                    }
                    if (currIndex === matches.length - 1 && typeof groupOne === 'undefined') {
                        return ''; // replace the match
                    }
                    return match;
                }));
                return;
            }
            const endsInSemicolon = /;\s*$/.test(currentStyle);
            const semicolon = endsInSemicolon ? '' : ';';
            parent.setAttribute('style', currentStyle + semicolon + `${styleProperty}: ${closedSize};`);
        };
        this.sandbox = new sandbox.Sandbox();
        this.state = {
            mustLoginDialogOpen: false,
        };
    }
    render() {
        const { mustLoginDialogOpen } = this.state;
        return (React.createElement("div", { className: this.props.classes.root },
            React.createElement(Notification_1.default, null),
            React.createElement(MustLoginDialog, { open: mustLoginDialogOpen, onClose: () => this.setState({ mustLoginDialogOpen: false }) }),
            React.createElement(AppBar_1.default, { position: "absolute" },
                React.createElement(Toolbar_1.default, { variant: "dense" },
                    React.createElement(Button_1.default, { color: "secondary", onClick: () => this.togglePanel('sideDrawer', 'width', 250, 0) },
                        React.createElement(FileCopy_1.default, null),
                        React.createElement("span", { id: "toolbar-buttons-text" }, "Files")),
                    React.createElement(ExecutionButtons, { sandbox: this.sandbox }),
                    React.createElement(DownloadButton, null),
                    React.createElement(Button_1.default, { color: "secondary", onClick: () => this.togglePanel('outputPanel', 'height', '25%', 0) },
                        React.createElement(NavigateNext_1.default, null),
                        React.createElement("span", { id: "toolbar-buttons-text" }, "Console")),
                    React.createElement(Button_1.default, { color: "secondary", onClick: () => this.togglePanel('codeEditor', 'width', '50%', '100%') },
                        React.createElement(Wallpaper_1.default, null),
                        React.createElement("span", { id: "toolbar-buttons-text" }, "Canvas")),
                    React.createElement(HistoryButton_1.default, null),
                    React.createElement("div", { style: classes.flex }),
                    React.createElement(offlineIndicator_1.OfflineIndicator, null),
                    React.createElement("div", { style: { display: 'inline-block', width: '0.5em' } }),
                    React.createElement(loginButton_1.default, null))),
            React.createElement(react_split_pane_1.default, { split: "vertical", style: { height: '100%' }, defaultSize: 250, minSize: 0 },
                React.createElement(SideDrawer_1.default, null),
                React.createElement("div", { className: this.props.classes.jumboContainer },
                    React.createElement("div", { className: this.props.classes.toolbar, style: { minHeight: '48px' } }),
                    React.createElement("div", { className: this.props.classes.jumboContent },
                        React.createElement(react_split_pane_1.default, { split: "horizontal", minSize: 0, defaultSize: "25%", primary: "second", pane2Style: { maxHeight: '100%' } },
                            React.createElement(react_split_pane_1.default, { split: "vertical", defaultSize: "50%", minSize: 0, maxSize: "100%", pane1Style: { maxWidth: '100%' } },
                                React.createElement("div", { style: { width: '100%', height: '100%', minWidth: '286px' }, id: "codeEditor" },
                                    React.createElement(CodeEditor_1.default, { openMustLogin: () => this.setState({ mustLoginDialogOpen: true }), sandbox: this.sandbox })),
                                React.createElement(CanvasOutput_1.default, null)),
                            React.createElement(OutputPanel_1.default, { sandbox: this.sandbox, aref: x => this.console = x, openMustLogin: () => this.setState({ mustLoginDialogOpen: true }) })))))));
    }
}
exports.JumboContentDefault = JumboContent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSnVtYm9Db250ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL0p1bWJvQ29udGVudC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0JBQStCO0FBQy9CLHVEQUF5QztBQUN6Qyw0REFBcUQ7QUFDckQsK0NBQXdDO0FBQ3hDLHlDQUF1QztBQUN2QyxzREFBK0M7QUFDL0MscURBQTRFO0FBQzVFLDREQUFvRDtBQUNwRCx3REFBaUQ7QUFDakQsOERBQXdEO0FBQ3hELHFEQUE4QztBQUM5QyxrREFBK0M7QUFDL0Msb0VBQTREO0FBRTVELHlEQUFxRDtBQUNyRCx1REFBMkQ7QUFDM0QsNkNBQXNDO0FBQ3RDLHlEQUFzRDtBQUN0RCw0REFBcUQ7QUFDckQscUNBQXFDO0FBQ3JDLCtDQUFzQztBQUN0Qyw4REFBdUQ7QUFDdkQsaUNBQWlDO0FBQ2pDLHFDQUFxQztBQUNyQyxzQkFBb0I7QUFDcEIscUNBQW1DO0FBRW5DLHlGQUF5RjtBQUN6RixxREFBOEM7QUFDOUMsdURBQWdEO0FBQ2hELDBEQUFtRDtBQUNuRCw0REFBc0Q7QUFDdEQsa0VBQTBEO0FBQzFELHFEQUE4QztBQUM5QyxtRUFBNEQ7QUFDNUQsbUVBQTREO0FBQzVELDJFQUFvRTtBQUNwRSwrREFBd0Q7QUFFdkQsTUFBYyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFFcEMsTUFBTSxPQUFPLEdBQUc7SUFDZCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsR0FBRztLQUNWO0lBQ0QsSUFBSSxFQUFFO1FBQ0osWUFBWSxFQUFFLFFBQVE7UUFDdEIsV0FBVyxFQUFFLEtBQUs7S0FDbkI7SUFDRCxLQUFLLEVBQUU7UUFDTCxVQUFVLEVBQUUsc0NBQXNDO1FBQ2xELFVBQVUsRUFBRSxLQUFLO0tBQ2xCO0NBQ0YsQ0FBQztBQUdGLE1BQU0sUUFBUSxHQUFHLHVCQUFjLENBQUM7SUFDOUIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVB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