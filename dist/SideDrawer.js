"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const List_1 = require("@material-ui/core/List");
const ListItem_1 = require("@material-ui/core/ListItem");
require("static/styles/DrawerIconButton.css");
require("static/styles/DrawerIconButton.css");
const ListItemStyles_1 = require("./components/ListItemStyles");
const core_1 = require("@material-ui/core");
const Add_1 = require("@material-ui/icons/Add");
const Typography_1 = require("@material-ui/core/Typography");
const state = require("./state");
require("static/styles/DrawerIconButton.css");
const Rx = require("rxjs");
const saveFileChanges_1 = require("./utils/api/saveFileChanges");
const apiHelpers_1 = require("./utils/api/apiHelpers");
const ListItemIcon_1 = require("@material-ui/core/ListItemIcon");
const Code_1 = require("@material-ui/icons/Code");
const ItemTypography_1 = require("./components/ItemTypography");
const Delete_1 = require("@material-ui/icons/Delete");
const IconButton_1 = require("@material-ui/core/IconButton");
const ListItemSecondaryAction_1 = require("@material-ui/core/ListItemSecondaryAction");
const Tooltip_1 = require("@material-ui/core/Tooltip");
const ListItemText_1 = require("@material-ui/core/ListItemText");
const Input_1 = require("@material-ui/core/Input");
const FormControl_1 = require("@material-ui/core/FormControl");
const FormHelperText_1 = require("@material-ui/core/FormHelperText");
const Drawer_1 = require("@material-ui/core/Drawer");
const styles_1 = require("@material-ui/core/styles");
const utils = require("./utils");
const reactrx_1 = require("./reactrx");
const errors_1 = require("./errors");
// NOTE (Sam): If you make any changes for isSimpleValidFileName
// You have to do the same for the backend, the backend has the exact
// same function to validate file names. If these functions don't match, errors can happen.
const isSimpleValidFileName = (fileName) => {
    return /^[\w\-]+\.js$/.test(fileName);
};
const NewFileField = ListItemStyles_1.default(class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newFileErrorMsg: '',
            loggedIn: false,
            files: state.files.getValue()
        };
        reactrx_1.connect(this, 'loggedIn', state.uiActive);
        reactrx_1.connect(this, 'files', state.files);
        this.listener = (event) => {
            if (event.keyCode !== 13 || event.target === null) {
                return;
            }
            const name = event.target.value;
            if (this.state.files.indexOf(name) !== -1) {
                this.setState({ newFileErrorMsg: 'Duplicated file name' });
                return;
            }
            if (!isSimpleValidFileName(name)) {
                this.setState({ newFileErrorMsg: 'File name must match regex [\w\\-]+\.js' });
                return;
            }
            this.props.deleteFileField();
            this.setState({ newFileErrorMsg: '' });
            state.notify('Creating new file ...');
            saveFileChanges_1.saveChanges({ fileName: name, type: 'create', changes: '' })
                .then(result => {
                if (result.status !== 'SUCCESS') {
                    throw 'failure response from server';
                }
                state.files.next([name, ...state.files.getValue()]);
                this.props.selectedFilename.next(name);
                state.loadProgram.next({ kind: 'program', name: name, content: '' });
                state.notify('File created.');
            })
                .catch(reason => {
                state.notify('Could not create file');
                errors_1.console.error(`failed to create file (reason: ${reason}`);
            });
        };
    }
    componentDidUpdate(prevProps) {
        if (this.props.newFile === prevProps.newFile) {
            return;
        }
        let filenameInput = document.getElementById('filename-input');
        if (filenameInput === null || !this.props.newFile) {
            return;
        }
        filenameInput.addEventListener('keyup', this.listener);
    }
    componentWillUnmount() {
        let filenameInput = document.getElementById('filename-input');
        if (filenameInput === null || !this.props.newFile) {
            return;
        }
        filenameInput.removeEventListener('keyup', this.listener);
    }
    render() {
        const { newFile, deleteFileField, classes } = this.props;
        const { newFileErrorMsg } = this.state;
        if (!newFile) {
            return null;
        }
        return (React.createElement(ListItem_1.default, { className: `${classes.nested} ${classes.listItemColor}`, classes: { dense: classes.tinyPadding }, dense: true },
            React.createElement(ListItemIcon_1.default, null,
                React.createElement(Code_1.default, { className: classes.listItemColor })),
            React.createElement(ListItemText_1.default, { disableTypography: true, primary: React.createElement(FormControl_1.default, { className: classes.formControl, "aria-describedby": "name-helper-text", margin: "none", error: newFileErrorMsg !== '' },
                    React.createElement(Input_1.default, { id: "filename-input", classes: {
                            root: classes.textField
                        }, autoFocus: true }),
                    newFileErrorMsg !== '' &&
                        React.createElement(FormHelperText_1.default, { id: "duplicate-error", margin: "dense" }, newFileErrorMsg)), classes: { root: classes.listItemColor } }),
            React.createElement(ListItemSecondaryAction_1.default, { className: `${classes.listItemColor}` },
                React.createElement(Tooltip_1.default, { disableFocusListener: true, disableTouchListener: true, id: "tooltip-icon", title: "Delete", classes: {
                        tooltipPlacementBottom: classes.closerTooltip
                    } },
                    React.createElement(IconButton_1.default, { "aria-label": "delete", color: "inherit", className: `${classes.listItemColor}`, onClick: () => { deleteFileField(); this.setState({ newFileErrorMsg: '' }); }, classes: { root: classes.noButtonBackground } },
                        React.createElement(Delete_1.default, { color: "inherit" }))))));
    }
});
const FileItem = ListItemStyles_1.default(class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFilename: props.selectedFilename.getValue(),
        };
        reactrx_1.connect(this, 'selectedFilename', props.selectedFilename);
    }
    onDelete() {
        const response = prompt(`Are you sure you want to permanently delete the file '${this.props.name}'? Enter YES to confirm.`);
        if (response !== "YES") {
            state.notification.next({ message: `Delete aborted: ${this.props.name}`, position: 'bottom-right' });
            return;
        }
        saveFileChanges_1.saveChanges({
            fileName: this.props.name,
            type: 'delete',
        }).then((response) => {
            if (this.state.selectedFilename === this.props.name) {
                this.props.selectedFilename.next(false);
            }
            state.files.next(state.files.getValue()
                .filter(x => x !== this.props.name));
            if (apiHelpers_1.isFailureResponse(response)) {
                state.notification.next({ message: `Unable to delete '${this.props.name}'`, position: 'bottom-right' });
            }
            state.notify(`Deleted ${this.props.name}`);
        }).catch(reason => errors_1.console.log(`Delete failed: ${reason}`));
    }
    render() {
        const { classes, name, disabled } = this.props;
        const isDisabled = disabled;
        const isSelected = name === this.state.selectedFilename;
        let preventActionWhenSaving = (onClickAction) => {
            return () => {
                if (state.dirty.getValue() === 'dirty') {
                    state.notify('File still saving, please wait...');
                    return;
                }
                onClickAction();
            };
        };
        return (React.createElement(ListItem_1.default, { button: true, disableGutters: true, className: `${classes.nested}`, classes: {
                root: `${isSelected && classes.selectedHighlight}`,
                dense: classes.tinyPadding,
            }, onClick: preventActionWhenSaving(() => { this.props.selectedFilename.next(name); }), dense: true, disabled: isDisabled },
            React.createElement(ListItemIcon_1.default, null,
                React.createElement(Code_1.default, { className: `${classes.codeIcon} ${classes.show}` })),
            React.createElement(ItemTypography_1.default, { text: name, className: classes.listItemColor, styleBody: true }),
            React.createElement(ListItemSecondaryAction_1.default, { className: `fadeIcon ${classes.listItemColor}` },
                React.createElement(Tooltip_1.default, { id: "tooltip-icon", title: "Delete", disableFocusListener: true, disableTouchListener: true, classes: {
                        tooltipPlacementBottom: classes.closerTooltip
                    } },
                    React.createElement("div", null,
                        "  ",
                        React.createElement(IconButton_1.default, { "aria-label": "Delete", color: "inherit", onClick: preventActionWhenSaving(() => this.onDelete()), classes: {
                                root: classes.noButtonBackground
                            }, disabled: isDisabled },
                            React.createElement(Delete_1.default, { color: "inherit" })))))));
    }
});
const UserFileItems = ListItemStyles_1.default(class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            files: state.files.getValue(),
        };
        reactrx_1.connect(this, 'loggedIn', state.uiActive);
        reactrx_1.connect(this, 'files', state.files);
    }
    render() {
        const { files, loggedIn } = this.state;
        let disabled = !loggedIn;
        return (React.createElement("div", { className: "fileList scrollbars", style: { height: '100%', overflowY: 'scroll' } }, files.map(name => React.createElement("div", { className: "fileItem", key: name },
            React.createElement(FileItem, { name: name, disabled: disabled, selectedFilename: this.props.selectedFilename })))));
    }
});
class SavedIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dirty: state.dirty.getValue()
        };
        reactrx_1.connect(this, 'dirty', state.dirty);
    }
    render() {
        const text = this.state.dirty === 'saved' ? 'All Changes Saved' : 'Saving ...';
        return (React.createElement("div", { style: { color: 'white', paddingLeft: '15px' } },
            React.createElement(Typography_1.default, null, text)));
    }
}
const FilesFolder = ListItemStyles_1.default(class extends React.Component {
    constructor(props) {
        super(props);
        this.newFileField = () => { this.setState({ hasNewFileField: true }); };
        this.state = {
            loggedIn: false,
            hasNewFileField: false,
            dirty: state.dirty.getValue()
        };
        reactrx_1.connect(this, 'loggedIn', state.uiActive);
        reactrx_1.connect(this, 'dirty', state.dirty);
        this.selectedFilename = new Rx.BehaviorSubject(false);
        this.selectedFilename.subscribe(name => {
            const email = state.email();
            if (name === false || email === false) {
                state.loadProgram.next({ kind: 'nothing' });
                return;
            }
            utils.postJson('read', { filename: name })
                .then(content => {
                // NOTE(arjun): assumes that content is a string
                state.loadProgram.next({ kind: 'program', name, content });
            })
                .catch(reason => {
                state.notify(`Failed to load ${name}. Please try again`);
                this.selectedFilename.next(false);
            });
        });
    }
    render() {
        return (React.createElement("div", { style: { height: '100%' } },
            React.createElement(List_1.default, { style: { height: '100%' }, disablePadding: true, dense: true },
                React.createElement(SavedIndicator, null),
                React.createElement("div", { style: { color: 'white', paddingLeft: '15px' } },
                    React.createElement(core_1.Button, { disabled: !(this.state.loggedIn && this.state.dirty === 'saved'), onClick: this.newFileField },
                        React.createElement(Add_1.default, null),
                        "New")),
                React.createElement(NewFileField, { selectedFilename: this.selectedFilename, newFile: this.state.hasNewFileField, deleteFileField: () => { this.setState({ hasNewFileField: false }); } }),
                React.createElement("div", { style: { height: 'calc(100% - 108px' } },
                    React.createElement(UserFileItems, { selectedFilename: this.selectedFilename })))));
    }
});
const sideDrawerStyles = theme => ({
    drawerPaper: {
        position: 'relative',
        width: '100%',
        backgroundColor: theme.palette.primary.main,
        overflow: 'hidden'
    },
    toolbar: theme.mixins.toolbar,
    noBorder: {
        borderRight: 'none'
    }
});
const SideDrawer = ({ classes }) => (React.createElement(Drawer_1.default, { variant: "permanent", anchor: "left", classes: {
        paper: classes.drawerPaper,
        paperAnchorDockedLeft: classes.noBorder
    }, style: { height: '100%' }, id: "sideDrawer" },
    React.createElement("div", { className: classes.toolbar, style: { minHeight: '48px' } }),
    React.createElement(List_1.default, { style: { height: '100%' }, dense: true },
        React.createElement(FilesFolder, null))));
exports.default = styles_1.withStyles(sideDrawerStyles)(SideDrawer);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2lkZURyYXdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9TaWRlRHJhd2VyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUErQjtBQUMvQixpREFBMEM7QUFDMUMseURBQWtEO0FBQ2xELDhDQUE0QztBQUM1Qyw4Q0FBNEM7QUFDNUMsZ0VBQXlEO0FBRXpELDRDQUF1RDtBQUN2RCxnREFBNkM7QUFDN0MsNkRBQXNEO0FBQ3RELGlDQUFpQztBQUNqQyw4Q0FBNEM7QUFDNUMsMkJBQTJCO0FBQzNCLGlFQUEwRDtBQUMxRCx1REFBMkQ7QUFDM0QsaUVBQTBEO0FBQzFELGtEQUErQztBQUMvQyxnRUFBNkQ7QUFDN0Qsc0RBQW1EO0FBQ25ELDZEQUFzRDtBQUN0RCx1RkFBZ0Y7QUFDaEYsdURBQWdEO0FBQ2hELGlFQUEwRDtBQUMxRCxtREFBNEM7QUFDNUMsK0RBQXdEO0FBQ3hELHFFQUE4RDtBQUM5RCxxREFBOEM7QUFDOUMscURBQTBFO0FBQzFFLGlDQUFpQztBQUNqQyx1Q0FBb0M7QUFDcEMscUNBQW1DO0FBRW5DLGdFQUFnRTtBQUNoRSxxRUFBcUU7QUFDckUsMkZBQTJGO0FBQzNGLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxRQUFnQixFQUFFLEVBQUU7SUFDL0MsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLENBQUMsQ0FBQztBQWNGLE1BQU0sWUFBWSxHQUFHLHdCQUFjLENBQUMsS0FBTSxTQUFRLEtBQUssQ0FBQyxTQUErQztJQUVuRyxZQUFZLEtBQXdCO1FBQ2hDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDVCxlQUFlLEVBQUUsRUFBRTtZQUNuQixRQUFRLEVBQUUsS0FBSztZQUNmLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtTQUNoQyxDQUFDO1FBQ0YsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQyxpQkFBTyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUN0QixJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO2dCQUMvQyxPQUFPO2FBQ1Y7WUFDRCxNQUFNLElBQUksR0FBSSxLQUFLLENBQUMsTUFBOEIsQ0FBQyxLQUFLLENBQUM7WUFDekQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFlLEVBQUUsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO2dCQUMzRCxPQUFPO2FBQ1Y7WUFDRCxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFlLEVBQUUseUNBQXlDLEVBQUUsQ0FBQyxDQUFDO2dCQUM5RSxPQUFPO2FBQ1Y7WUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFlLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN2QyxLQUFLLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDdEMsNkJBQVcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUM7aUJBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDWCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO29CQUM3QixNQUFNLDhCQUE4QixDQUFDO2lCQUN4QztnQkFDRCxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3BFLEtBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDWixLQUFLLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQ3RDLGdCQUFPLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQzlELENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELGtCQUFrQixDQUFDLFNBQTRCO1FBQzNDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUMxQyxPQUFPO1NBQ1Y7UUFDRCxJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUQsSUFBSSxhQUFhLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDL0MsT0FBTztTQUNWO1FBQ0QsYUFBYSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELG9CQUFvQjtRQUNoQixJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUQsSUFBSSxhQUFhLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDL0MsT0FBTztTQUNWO1FBQ0QsYUFBYSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELE1BQU07UUFDRixNQUFNLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pELE1BQU0sRUFBRSxlQUFlLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRXZDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDVixPQUFPLElBQUksQ0FBQztTQUNmO1FBRUQsT0FBTyxDQUNILG9CQUFDLGtCQUFRLElBQ0wsU0FBUyxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQ3ZELE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQ3ZDLEtBQUs7WUFFTCxvQkFBQyxzQkFBWTtnQkFDVCxvQkFBQyxjQUFRLElBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEdBQUksQ0FDbkM7WUFDZixvQkFBQyxzQkFBWSxJQUNULGlCQUFpQixRQUNqQixPQUFPLEVBQ0gsb0JBQUMscUJBQVcsSUFDUixTQUFTLEVBQUUsT0FBTyxDQUFDLFdBQVcsc0JBQ2Isa0JBQWtCLEVBQ25DLE1BQU0sRUFBQyxNQUFNLEVBQ2IsS0FBSyxFQUFFLGVBQWUsS0FBSyxFQUFFO29CQUU3QixvQkFBQyxlQUFLLElBQ0YsRUFBRSxFQUFDLGdCQUFnQixFQUNuQixPQUFPLEVBQUU7NEJBQ0wsSUFBSSxFQUFFLE9BQU8sQ0FBQyxTQUFTO3lCQUMxQixFQUNELFNBQVMsU0FFWDtvQkFFRSxlQUFlLEtBQUssRUFBRTt3QkFDdEIsb0JBQUMsd0JBQWMsSUFDWCxFQUFFLEVBQUMsaUJBQWlCLEVBQ3BCLE1BQU0sRUFBQyxPQUFPLElBRWIsZUFBZSxDQUNILENBRVgsRUFFbEIsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsR0FDMUM7WUFDRixvQkFBQyxpQ0FBdUIsSUFDcEIsU0FBUyxFQUFFLEdBQUcsT0FBTyxDQUFDLGFBQWEsRUFBRTtnQkFFckMsb0JBQUMsaUJBQU8sSUFDSixvQkFBb0IsUUFDcEIsb0JBQW9CLFFBQ3BCLEVBQUUsRUFBQyxjQUFjLEVBQ2pCLEtBQUssRUFBQyxRQUFRLEVBQ2QsT0FBTyxFQUFFO3dCQUNMLHNCQUFzQixFQUFFLE9BQU8sQ0FBQyxhQUFhO3FCQUNoRDtvQkFFRCxvQkFBQyxvQkFBVSxrQkFDSSxRQUFRLEVBQ25CLEtBQUssRUFBQyxTQUFTLEVBQ2YsU0FBUyxFQUFFLEdBQUcsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUNyQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsZUFBZSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsZUFBZSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQzdFLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsa0JBQWtCLEVBQUU7d0JBRTdDLG9CQUFDLGdCQUFVLElBQUMsS0FBSyxFQUFDLFNBQVMsR0FBRyxDQUNyQixDQUNQLENBQ1ksQ0FDbkIsQ0FFZCxDQUFDO0lBQ04sQ0FBQztDQUNKLENBQUMsQ0FBQztBQVVILE1BQU0sUUFBUSxHQUFHLHdCQUFjLENBQUMsS0FBTSxTQUFRLEtBQUssQ0FBQyxTQUFvRTtJQUVwSCxZQUFZLEtBQTRCO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDVCxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFO1NBQ3RELENBQUM7UUFDRixpQkFBTyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBR0QsUUFBUTtRQUNKLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyx5REFBeUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLDBCQUEwQixDQUFDLENBQUM7UUFDNUgsSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFO1lBQ3RCLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLG1CQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBQ3JHLE9BQU87U0FDUjtRQUNELDZCQUFXLENBQUM7WUFDVixRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJO1lBQ3pCLElBQUksRUFBRSxRQUFRO1NBQ2YsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ2pCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtnQkFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDM0M7WUFDRCxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtpQkFDOUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLDhCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUMvQixLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQzthQUN6RztZQUNELEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsTUFBTTtRQUNGLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7UUFDOUMsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFBO1FBQzNCLE1BQU0sVUFBVSxHQUFHLElBQUksS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDO1FBRXhELElBQUksdUJBQXVCLEdBQUcsQ0FBQyxhQUF5QixFQUFFLEVBQUU7WUFDeEQsT0FBTyxHQUFHLEVBQUU7Z0JBQ1IsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLE9BQU8sRUFBRTtvQkFDcEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO29CQUNsRCxPQUFPO2lCQUNWO2dCQUNELGFBQWEsRUFBRSxDQUFDO1lBQ3BCLENBQUMsQ0FBQTtRQUNMLENBQUMsQ0FBQztRQUNGLE9BQU8sQ0FDSCxvQkFBQyxrQkFBUSxJQUNMLE1BQU0sUUFDTixjQUFjLFFBQ2QsU0FBUyxFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUM5QixPQUFPLEVBQUU7Z0JBQ0wsSUFBSSxFQUFFLEdBQUcsVUFBVSxJQUFJLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtnQkFDbEQsS0FBSyxFQUFFLE9BQU8sQ0FBQyxXQUFXO2FBQzdCLEVBQ0QsT0FBTyxFQUFFLHVCQUF1QixDQUFDLEdBQUcsRUFBRSxHQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBLENBQUEsQ0FBQyxDQUFDLEVBQ2hGLEtBQUssUUFDTCxRQUFRLEVBQUUsVUFBVTtZQUVwQixvQkFBQyxzQkFBWTtnQkFDVCxvQkFBQyxjQUFRLElBQ0wsU0FBUyxFQUFFLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQ2xELENBQ1M7WUFDZixvQkFBQyx3QkFBa0IsSUFDZixJQUFJLEVBQUUsSUFBSSxFQUNWLFNBQVMsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUNoQyxTQUFTLFNBQ1g7WUFDRixvQkFBRSxpQ0FBdUIsSUFBQyxTQUFTLEVBQUUsWUFBWSxPQUFPLENBQUMsYUFBYSxFQUFFO2dCQUNwRSxvQkFBQyxpQkFBTyxJQUNKLEVBQUUsRUFBQyxjQUFjLEVBQ2pCLEtBQUssRUFBQyxRQUFRLEVBQ2Qsb0JBQW9CLFFBQ3BCLG9CQUFvQixRQUNwQixPQUFPLEVBQUU7d0JBQ0wsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLGFBQWE7cUJBQ2hEO29CQUVEOzt3QkFFSSxvQkFBQyxvQkFBVSxrQkFDSSxRQUFRLEVBQ25CLEtBQUssRUFBQyxTQUFTLEVBQ2YsT0FBTyxFQUFFLHVCQUF1QixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUN2RCxPQUFPLEVBQUU7Z0NBQ0wsSUFBSSxFQUFFLE9BQU8sQ0FBQyxrQkFBa0I7NkJBQ25DLEVBQ0QsUUFBUSxFQUFFLFVBQVU7NEJBRXBCLG9CQUFDLGdCQUFVLElBQUMsS0FBSyxFQUFDLFNBQVMsR0FBRyxDQUNyQixDQUNYLENBQ0EsQ0FDWSxDQUNuQixDQUNkLENBQUM7SUFDTixDQUFDO0NBQ0osQ0FBQyxDQUFDO0FBRUgsTUFBTSxhQUFhLEdBQUcsd0JBQWMsQ0FBQyxLQUFNLFNBQVEsS0FBSyxDQUFDLFNBQW1IO0lBRXhLLFlBQVksS0FBdUU7UUFDL0UsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2IsSUFBSSxDQUFDLEtBQUssR0FBRztZQUNULFFBQVEsRUFBRSxLQUFLO1lBQ2YsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO1NBQ2hDLENBQUM7UUFDRixpQkFBTyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELE1BQU07UUFDRixNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdkMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUM7UUFDekIsT0FBTyxDQUNMLDZCQUFLLFNBQVMsRUFBQyxxQkFBcUIsRUFBQyxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQyxRQUFRLEVBQUMsSUFDN0UsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUNqQiw2QkFBSyxTQUFTLEVBQUMsVUFBVSxFQUFDLEdBQUcsRUFBRSxJQUFJO1lBQy9CLG9CQUFDLFFBQVEsSUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQ3BDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEdBQUksQ0FDbkQsQ0FBQyxDQUNILENBQ1AsQ0FBQztJQUNOLENBQUM7Q0FDSixDQUFDLENBQUE7QUFRRixNQUFNLGNBQWUsU0FBUSxLQUFLLENBQUMsU0FBcUM7SUFFcEUsWUFBWSxLQUFTO1FBQ2pCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxLQUFLLEdBQUc7WUFDVCxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7U0FDaEMsQ0FBQztRQUNGLGlCQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELE1BQU07UUFDRixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFDL0UsT0FBTyxDQUNILDZCQUFLLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRTtZQUM5QyxvQkFBQyxvQkFBVSxRQUNOLElBQUksQ0FDSSxDQUNYLENBQ1QsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQUVELE1BQU0sV0FBVyxHQUFHLHdCQUFjLENBQUMsS0FBTSxTQUFRLEtBQUssQ0FBQyxTQUF1QjtJQUkxRSxZQUFZLEtBQVk7UUFDcEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBNEJqQixpQkFBWSxHQUFHLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQztRQTNCOUQsSUFBSSxDQUFDLEtBQUssR0FBRztZQUNULFFBQVEsRUFBRSxLQUFLO1lBQ2YsZUFBZSxFQUFFLEtBQUs7WUFDdEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO1NBQ2hDLENBQUM7UUFDRixpQkFBTyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBaUIsS0FBSyxDQUFDLENBQUM7UUFDdEUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNuQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDNUIsSUFBSSxJQUFJLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSyxLQUFLLEVBQUU7Z0JBQ25DLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7Z0JBQzVDLE9BQU87YUFDVjtZQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDO2lCQUNyQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1osZ0RBQWdEO2dCQUNoRCxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDL0QsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDWixLQUFLLENBQUMsTUFBTSxDQUFDLGtCQUFrQixJQUFJLG9CQUFvQixDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEMsQ0FBQyxDQUFDLENBQUE7UUFDVixDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFJRCxNQUFNO1FBQ0YsT0FBTyxDQUNILDZCQUFLLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUM7WUFDdkIsb0JBQUMsY0FBSSxJQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsRUFBRyxjQUFjLFFBQUMsS0FBSztnQkFDL0Msb0JBQUMsY0FBYyxPQUFHO2dCQUNsQiw2QkFBSyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUU7b0JBQzlDLG9CQUFDLGFBQU0sSUFDQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLE9BQU8sQ0FBQyxFQUNoRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVk7d0JBQzlCLG9CQUFDLGFBQU8sT0FBRzs4QkFFTixDQUNQO2dCQUNOLG9CQUFDLFlBQVksSUFDVCxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQ3ZDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFDbkMsZUFBZSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQSxDQUFDLENBQUMsR0FDdEU7Z0JBQ0YsNkJBQUssS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFDLG1CQUFtQixFQUFDO29CQUN0QyxvQkFBQyxhQUFhLElBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixHQUFJLENBQ3JELENBQ0osQ0FDTCxDQUNULENBQUM7SUFDTixDQUFDO0NBQ0osQ0FBQyxDQUFDO0FBR0gsTUFBTSxnQkFBZ0IsR0FBdUIsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELFdBQVcsRUFBRTtRQUNULFFBQVEsRUFBRSxVQUFVO1FBQ3BCLEtBQUssRUFBRSxNQUFNO1FBQ2IsZUFBZSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUk7UUFDM0MsUUFBUSxFQUFFLFFBQVE7S0FDckI7SUFDRCxPQUFPLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPO0lBQzdCLFFBQVEsRUFBRTtRQUNOLFdBQVcsRUFBRSxNQUFNO0tBQ3RCO0NBQ0osQ0FBQyxDQUFDO0FBSUgsTUFBTSxVQUFVLEdBQStELENBQzNFLEVBQUUsT0FBTyxFQUFFLEVBQ2IsRUFBRSxDQUFDLENBQ0csb0JBQUMsZ0JBQU0sSUFDSCxPQUFPLEVBQUMsV0FBVyxFQUNuQixNQUFNLEVBQUMsTUFBTSxFQUNiLE9BQU8sRUFBRTtRQUNMLEtBQUssRUFBRSxPQUFPLENBQUMsV0FBVztRQUMxQixxQkFBcUIsRUFBRSxPQUFPLENBQUMsUUFBUTtLQUMxQyxFQUNELEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsRUFDdEIsRUFBRSxFQUFDLFlBQVk7SUFFZiw2QkFBSyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFDLEdBQUc7SUFFOUQsb0JBQUMsY0FBSSxJQUFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsRUFBRSxLQUFLO1FBQy9CLG9CQUFDLFdBQVcsT0FBRyxDQUNaLENBQ0YsQ0FDWixDQUFDO0FBRU4sa0JBQWUsbUJBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDIn0=