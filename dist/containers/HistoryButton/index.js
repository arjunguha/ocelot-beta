"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Fade_1 = require("@material-ui/core/Fade");
const List_1 = require("@material-ui/core/List");
require("../../static/styles/Scrollbar.css");
const Paper_1 = require("@material-ui/core/Paper");
const Button_1 = require("@material-ui/core/Button");
const Popper_1 = require("@material-ui/core/Popper");
const ListItem_1 = require("@material-ui/core/ListItem");
const Collapse_1 = require("@material-ui/core/Collapse");
const History_1 = require("@material-ui/icons/History");
const Typography_1 = require("@material-ui/core/Typography");
const BubbleChart_1 = require("@material-ui/icons/BubbleChart");
const ListItemIcon_1 = require("@material-ui/core/ListItemIcon");
const ListItemText_1 = require("@material-ui/core/ListItemText");
const apiHelpers_1 = require("../../utils/api/apiHelpers");
const CircularProgress_1 = require("@material-ui/core/CircularProgress");
const ClickAwayListener_1 = require("@material-ui/core/ClickAwayListener");
const getHistory_1 = require("../../utils/api/getHistory");
const styles_1 = require("@material-ui/core/styles");
const react_monaco_editor_1 = require("react-monaco-editor");
const saveHistory_1 = require("../../utils/api/saveHistory");
const state = require("../../state");
const reactrx_1 = require("../../reactrx");
const errors_1 = require("../../errors");
const styles = theme => ({
    list: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.primary.main,
    },
    listItems: {
        overflowY: 'auto',
        height: '324px',
        width: '400px',
    },
    newDense: {
        paddingBottom: '0px',
    },
    secondaryText: {
        fontFamily: '\'Fira Mono\', monospace',
    },
    sameCode: {
        backgroundColor: theme.palette.secondary.dark + '9e',
    }
});
const monacoOptions = {
    wordWrap: 'on',
    overviewRulerLanes: 0,
    glyphMargin: false,
    lineNumbers: 'off',
    folding: false,
    selectOnLineNumbers: false,
    // cursorStyle: 'line-thin',
    scrollbar: {
        useShadows: false,
        horizontal: 'hidden',
        verticalScrollbarSize: 9,
    },
    minimap: {
        enabled: false,
    },
    contextmenu: false,
    readOnly: true,
    fontFamily: 'Fira Mono',
    fontSize: 10,
    renderSideBySide: false
};
const truncateString = (str) => {
    if (str.length > 25) {
        return str.substr(0, 25).replace(/\n/g, '⏎') + '...';
    }
    return str.replace(/\n/g, '⏎');
};
class HistoryButton extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = () => {
            this.openHistory();
            this.setState({ loading: true });
            getHistory_1.getFileHistory(state.currentFileName()).then(response => {
                this.setState({ loading: false, history: [] });
                if (apiHelpers_1.isFailureResponse(response)) {
                    // tslint:disable-next-line:no-console
                    errors_1.console.log(response.data.message);
                    // probably a notification.
                    return;
                }
                this.setState({ history: response.data.history });
            }).catch(err => {
                // tslint:disable-next-line:no-console
                errors_1.console.log(err);
            });
        };
        this.onClickAway = () => { this.setState({ open: false, codeOpenIndex: -1 }); };
        this.openHistory = () => { this.setState({ open: true }); };
        this.toggleCode = (index) => {
            if (this.state.codeOpenIndex === index) {
                this.setState({ codeOpenIndex: -1 });
                return;
            }
            this.setState({ codeOpenIndex: index });
        };
        this.onRestore = (index, generation) => {
            return () => {
                this.setState({ open: false, codeOpenIndex: -1 });
                saveHistory_1.saveHistory(state.currentFileName(), this.state.history[index].code, generation);
                // TODO(arjun): I suggest we not do this
                setTimeout(() => {
                    if (this.state.currentProgram.kind !== 'program') {
                        return;
                    }
                    // The UI looks 'buggy' if I were to not setTimeout
                    const editor = state.currentProgram.getValue();
                    const { history } = this.state;
                    if (editor === undefined || history.length - 1 < index) {
                        return;
                    }
                    state.loadProgram.next({
                        kind: 'program',
                        name: this.state.currentProgram.name,
                        content: this.state.history[index].code
                    });
                }, 30);
            };
        };
        this.state = {
            open: false,
            loggedIn: false,
            loading: false,
            history: [],
            codeOpenIndex: -1,
            currentProgram: state.currentProgram.getValue()
        };
        reactrx_1.connect(this, 'loggedIn', state.uiActive);
        reactrx_1.connect(this, 'currentProgram', state.currentProgram);
    }
    render() {
        if (!this.state.loggedIn) {
            return null;
        }
        const { classes } = this.props;
        const { open, loading, history, codeOpenIndex, currentProgram } = this.state;
        let content = React.createElement(CircularProgress_1.default, { size: 50, style: { marginTop: '125px', marginLeft: '175px' }, color: "inherit" });
        if (!loading && currentProgram.kind === 'program') {
            content = history.map((elem, index) => (React.createElement("div", { key: `${elem.timeCreated}${index}`, className: currentProgram.content === elem.code ? `${classes.sameCode}` : '' },
                React.createElement(ListItem_1.default, { button: true, onClick: () => this.toggleCode(index) },
                    React.createElement(ListItemIcon_1.default, null,
                        React.createElement(BubbleChart_1.default, null)),
                    React.createElement(ListItemText_1.default, { classes: {
                            secondary: classes.secondaryText
                        }, primary: `${elem.dateCreated} ${elem.timeCreated}`, secondary: `${truncateString(elem.code)}` })),
                React.createElement(Collapse_1.default, { in: codeOpenIndex === index, timeout: "auto", unmountOnExit: true },
                    React.createElement(List_1.default, { dense: true },
                        React.createElement(ListItem_1.default, null,
                            React.createElement("div", { style: { height: '100%', width: '100%' } },
                                React.createElement(react_monaco_editor_1.MonacoDiffEditor, { language: "elementaryjs", height: 210, original: currentProgram.content, value: elem.code, options: monacoOptions }),
                                currentProgram.content !== elem.code &&
                                    React.createElement(Button_1.default, { variant: "outlined", color: "secondary", fullWidth: true, style: { marginTop: '1em', alignSelf: 'right' }, onClick: this.onRestore(index, elem.generation) }, "Restore"))))))));
        }
        if (!loading && history.length === 0) {
            content = React.createElement(Typography_1.default, { variant: "headline", align: "center", color: "inherit", style: { marginTop: '150px' } }, "No history saved");
        }
        return (React.createElement("div", null,
            React.createElement(Button_1.default, { disabled: currentProgram.kind !== 'program', color: "secondary", onClick: this.onClick },
                React.createElement(History_1.default, null),
                React.createElement("span", { id: "toolbar-buttons-text" }, "History")),
            React.createElement(Popper_1.default, { open: open, placement: "bottom-end", anchorEl: this.anchorEl, disablePortal: true, modifiers: {
                    flip: {
                        enabled: true,
                    },
                    preventOverflow: {
                        enabled: true,
                        boundariesElement: 'scrollParent',
                    },
                }, transition: true }, ({ TransitionProps }) => (React.createElement(Fade_1.default, Object.assign({}, TransitionProps, { timeout: 150 }),
                React.createElement(Paper_1.default, null,
                    React.createElement(ClickAwayListener_1.default, { onClickAway: this.onClickAway },
                        React.createElement("div", { className: classes.list },
                            React.createElement(List_1.default, { dense: true, classes: {
                                    dense: classes.newDense
                                } },
                                React.createElement("div", { className: `${classes.listItems} scrollbars` }, content))))))))));
    }
}
exports.default = styles_1.withStyles(styles)(HistoryButton);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29udGFpbmVycy9IaXN0b3J5QnV0dG9uL2luZGV4LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUErQjtBQUMvQixpREFBMEM7QUFDMUMsaURBQTBDO0FBQzFDLDZDQUEyQztBQUMzQyxtREFBNEM7QUFDNUMscURBQThDO0FBQzlDLHFEQUE4QztBQUM5Qyx5REFBa0Q7QUFDbEQseURBQWtEO0FBQ2xELHdEQUFxRDtBQUNyRCw2REFBc0Q7QUFDdEQsZ0VBQXdEO0FBQ3hELGlFQUEwRDtBQUMxRCxpRUFBMEQ7QUFDMUQsMkRBQStEO0FBQy9ELHlFQUFrRTtBQUNsRSwyRUFBb0U7QUFDcEUsMkRBQXlFO0FBQ3pFLHFEQUFzRjtBQUN0Riw2REFBdUQ7QUFFdkQsNkRBQTBEO0FBQzFELHFDQUFxQztBQUNyQywyQ0FBd0M7QUFDeEMseUNBQXVDO0FBRXZDLE1BQU0sTUFBTSxHQUF1QixLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekMsSUFBSSxFQUFFO1FBQ0YsS0FBSyxFQUFFLE1BQU07UUFDYixNQUFNLEVBQUUsTUFBTTtRQUNkLGVBQWUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJO0tBQzlDO0lBQ0QsU0FBUyxFQUFFO1FBQ1AsU0FBUyxFQUFFLE1BQU07UUFDakIsTUFBTSxFQUFFLE9BQU87UUFDZixLQUFLLEVBQUUsT0FBTztLQUNqQjtJQUNELFFBQVEsRUFBRTtRQUNOLGFBQWEsRUFBRSxLQUFLO0tBQ3ZCO0lBQ0QsYUFBYSxFQUFFO1FBQ1gsVUFBVSxFQUFFLDBCQUEwQjtLQUN6QztJQUNELFFBQVEsRUFBRTtRQUNOLGVBQWUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSTtLQUN2RDtDQUNKLENBQUMsQ0FBQztBQVNILE1BQU0sYUFBYSxHQUF1RDtJQUN0RSxRQUFRLEVBQUUsSUFBSTtJQUNkLGtCQUFrQixFQUFFLENBQUM7SUFDckIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsT0FBTyxFQUFFLEtBQUs7SUFDZCxtQkFBbUIsRUFBRSxLQUFLO0lBQzFCLDRCQUE0QjtJQUM1QixTQUFTLEVBQUU7UUFDUCxVQUFVLEVBQUUsS0FBSztRQUNqQixVQUFVLEVBQUUsUUFBUTtRQUNwQixxQkFBcUIsRUFBRSxDQUFDO0tBQzNCO0lBQ0QsT0FBTyxFQUFFO1FBQ0wsT0FBTyxFQUFFLEtBQUs7S0FDakI7SUFDRCxXQUFXLEVBQUUsS0FBSztJQUNsQixRQUFRLEVBQUUsSUFBSTtJQUNkLFVBQVUsRUFBRSxXQUFXO0lBQ3ZCLFFBQVEsRUFBRSxFQUFFO0lBQ1osZ0JBQWdCLEVBQUUsS0FBSztDQUMxQixDQUFDO0FBYUYsTUFBTSxjQUFjLEdBQUcsQ0FBQyxHQUFXLEVBQUUsRUFBRTtJQUNuQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO1FBQ2pCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDeEQ7SUFDRCxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ25DLENBQUMsQ0FBQztBQUVGLE1BQU0sYUFBYyxTQUFRLEtBQUssQ0FBQyxTQUF1QjtJQUVyRCxZQUFZLEtBQVk7UUFDcEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBYWpCLFlBQU8sR0FBRyxHQUFHLEVBQUU7WUFDWCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2pDLDJCQUFjLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDL0MsSUFBSSw4QkFBaUIsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDN0Isc0NBQXNDO29CQUN0QyxnQkFBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNuQywyQkFBMkI7b0JBQzNCLE9BQU87aUJBQ1Y7Z0JBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDdEQsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNYLHNDQUFzQztnQkFDdEMsZ0JBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7UUFFRixnQkFBVyxHQUFHLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0UsZ0JBQVcsR0FBRyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkQsZUFBVSxHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7WUFDM0IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsS0FBSyxLQUFLLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQyxPQUFPO2FBQ1Y7WUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDO1FBRUYsY0FBUyxHQUFHLENBQUMsS0FBYSxFQUFFLFVBQWtCLEVBQUUsRUFBRTtZQUM5QyxPQUFPLEdBQUcsRUFBRTtnQkFDUixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNsRCx5QkFBVyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUE7Z0JBQ2hGLHdDQUF3QztnQkFDeEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDWixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7d0JBQzlDLE9BQU87cUJBQ1Y7b0JBQ0QsbURBQW1EO29CQUNuRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUMvQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztvQkFDL0IsSUFBSSxNQUFNLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEtBQUssRUFBRTt3QkFDcEQsT0FBTztxQkFDVjtvQkFDRCxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQzt3QkFDbkIsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUk7d0JBQ3BDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJO3FCQUMxQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFBO1FBaEVHLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDVCxJQUFJLEVBQUUsS0FBSztZQUNYLFFBQVEsRUFBRSxLQUFLO1lBQ2YsT0FBTyxFQUFFLEtBQUs7WUFDZCxPQUFPLEVBQUUsRUFBRTtZQUNYLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFDakIsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFO1NBQ2xELENBQUM7UUFDRixpQkFBTyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBd0RELE1BQU07UUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDdEIsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQy9CLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM3RSxJQUFJLE9BQU8sR0FBZ0Msb0JBQUMsMEJBQWdCLElBQ3hELElBQUksRUFBRSxFQUFFLEVBQ1IsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEVBQ2xELEtBQUssRUFBQyxTQUFTLEdBRWpCLENBQUE7UUFDRixJQUFJLENBQUMsT0FBTyxJQUFJLGNBQWMsQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO1lBQy9DLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FDbkMsNkJBQ0ksR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLEVBQUUsRUFDbEMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBRTVFLG9CQUFDLGtCQUFRLElBQUMsTUFBTSxRQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztvQkFDbEQsb0JBQUMsc0JBQVk7d0JBQ1Qsb0JBQUMscUJBQVUsT0FBRyxDQUNIO29CQUNmLG9CQUFDLHNCQUFZLElBQ1QsT0FBTyxFQUFFOzRCQUNMLFNBQVMsRUFBRSxPQUFPLENBQUMsYUFBYTt5QkFDbkMsRUFDRCxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFDbEQsU0FBUyxFQUFFLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUMzQyxDQUNLO2dCQUNYLG9CQUFDLGtCQUFRLElBQUMsRUFBRSxFQUFFLGFBQWEsS0FBSyxLQUFLLEVBQUUsT0FBTyxFQUFDLE1BQU0sRUFBQyxhQUFhO29CQUMvRCxvQkFBQyxjQUFJLElBQUUsS0FBSzt3QkFDUixvQkFBQyxrQkFBUTs0QkFDTCw2QkFBSyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0NBQ3pDLG9CQUFDLHNDQUFnQixJQUNiLFFBQVEsRUFBQyxjQUFjLEVBQ3ZCLE1BQU0sRUFBRSxHQUFHLEVBQ1gsUUFBUSxFQUFFLGNBQWMsQ0FBQyxPQUFPLEVBQ2hDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxFQUNoQixPQUFPLEVBQUUsYUFBYSxHQUN4QjtnQ0FFRSxjQUFjLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJO29DQUNwQyxvQkFBQyxnQkFBTSxJQUNILE9BQU8sRUFBQyxVQUFVLEVBQ2xCLEtBQUssRUFBQyxXQUFXLEVBQ2pCLFNBQVMsUUFDVCxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFDL0MsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsY0FJMUMsQ0FFWCxDQUNDLENBQ1IsQ0FDQSxDQUNULENBQ1QsQ0FBQyxDQUFDO1NBQ047UUFDRCxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLE9BQU8sR0FBRyxvQkFBQyxvQkFBVSxJQUNqQixPQUFPLEVBQUMsVUFBVSxFQUNsQixLQUFLLEVBQUMsUUFBUSxFQUNkLEtBQUssRUFBQyxTQUFTLEVBQ2YsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSx1QkFHcEIsQ0FBQTtTQUNoQjtRQUNELE9BQU8sQ0FDSDtZQUNJLG9CQUFDLGdCQUFNLElBQ0MsUUFBUSxFQUFFLGNBQWMsQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUMzQyxLQUFLLEVBQUMsV0FBVyxFQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQ3pCLG9CQUFDLGlCQUFXLE9BQUc7Z0JBQ2YsOEJBQU0sRUFBRSxFQUFDLHNCQUFzQixjQUFlLENBQ3pDO1lBQ1Qsb0JBQUMsZ0JBQU0sSUFDSCxJQUFJLEVBQUUsSUFBSSxFQUNWLFNBQVMsRUFBQyxZQUFZLEVBQ3RCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUN2QixhQUFhLEVBQUUsSUFBSSxFQUNuQixTQUFTLEVBQUU7b0JBQ1AsSUFBSSxFQUFFO3dCQUNGLE9BQU8sRUFBRSxJQUFJO3FCQUNoQjtvQkFDRCxlQUFlLEVBQUU7d0JBQ2IsT0FBTyxFQUFFLElBQUk7d0JBQ2IsaUJBQWlCLEVBQUUsY0FBYztxQkFDcEM7aUJBQ0osRUFDRCxVQUFVLFVBRVQsQ0FBQyxFQUFFLGVBQWUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUN0QixvQkFBQyxjQUFJLG9CQUFLLGVBQWUsSUFBRSxPQUFPLEVBQUUsR0FBRztnQkFDbkMsb0JBQUMsZUFBSztvQkFDRixvQkFBQywyQkFBaUIsSUFBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7d0JBQzVDLDZCQUFLLFNBQVMsRUFBRSxPQUFPLENBQUMsSUFBSTs0QkFDeEIsb0JBQUMsY0FBSSxJQUNELEtBQUssUUFDTCxPQUFPLEVBQUU7b0NBQ0wsS0FBSyxFQUFFLE9BQU8sQ0FBQyxRQUFRO2lDQUMxQjtnQ0FFRCw2QkFBSyxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUMsU0FBUyxhQUFhLElBQzVDLE9BQU8sQ0FDTixDQUNILENBQ0wsQ0FDVSxDQUNoQixDQUNMLENBQ1YsQ0FDSSxDQUNQLENBQ1QsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQUVELGtCQUFlLG1CQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMifQ==