"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Snackbar_1 = require("@material-ui/core/Snackbar");
const IconButton_1 = require("@material-ui/core/IconButton");
const Close_1 = require("@material-ui/icons/Close");
const styles_1 = require("@material-ui/core/styles");
const state = require("../../../state");
// the styles for styling an element with:
// close class i.e. equivalent to .close in css
const styles = theme => ({
    close: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    }
});
/**
 * A presentational component that shows an Error in the form of a snackbar.
 * It takes in WithStyles and ErrorSnackbarProps as props. WithStyles is for
 * styling, the actual props are ErrorSnackbarProps
 *
 * @param {(WithStyles<'close'> & ErrorSnackbarProps)} props
 * @returns {React.ComponentType<Snackbar>}
 */
class ErrorSnackbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: '',
            position: 'top'
        };
    }
    // We need componentDidMount to setup a subscription that opens the
    // notification bar on each message.
    componentDidMount() {
        state.notification.subscribe(next => {
            this.setState({
                open: true,
                message: next.message,
                position: next.position
            });
        });
    }
    handleClose(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ open: false });
    }
    ;
    render() {
        const props = this.props;
        let anchorOrigin = {
            vertical: 'top',
            horizontal: 'center',
        };
        if (this.state.position === 'bottom-right') {
            anchorOrigin = { vertical: 'bottom', horizontal: 'right' };
        }
        return (React.createElement(Snackbar_1.default, { anchorOrigin: anchorOrigin, open: this.state.open, autoHideDuration: 5000, onClose: (event, reason) => this.handleClose(event, reason), ContentProps: {
                'aria-describedby': 'message-id',
            }, message: React.createElement("span", { id: "message-id" }, this.state.message), action: [
                React.createElement(IconButton_1.default, { key: "close", "aria-label": "Close", color: "inherit", className: props.classes.close, onClick: () => this.setState({ open: false }) },
                    React.createElement(Close_1.default, { color: "secondary" })),
            ] }));
    }
}
exports.default = styles_1.withStyles(styles)(ErrorSnackbar);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90aWZpY2F0aW9uQmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbnRhaW5lcnMvTm90aWZpY2F0aW9uL2NvbXBvbmVudHMvTm90aWZpY2F0aW9uQmFyLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUErQjtBQUMvQix5REFBc0U7QUFDdEUsNkRBQXNEO0FBQ3RELG9EQUFpRDtBQUNqRCxxREFBc0Y7QUFDdEYsd0NBQXdDO0FBRXhDLDBDQUEwQztBQUMxQywrQ0FBK0M7QUFDL0MsTUFBTSxNQUFNLEdBQXVCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QyxLQUFLLEVBQUU7UUFDSCxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUM3QixNQUFNLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQztLQUNqQztDQUNKLENBQUMsQ0FBQztBQVNIOzs7Ozs7O0dBT0c7QUFDSCxNQUFNLGFBQWMsU0FBUSxLQUFLLENBQUMsU0FBcUM7SUFFbkUsWUFBWSxLQUEwQjtRQUNsQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1QsSUFBSSxFQUFFLEtBQUs7WUFDWCxPQUFPLEVBQUUsRUFBRTtZQUNYLFFBQVEsRUFBRSxLQUFLO1NBQ2xCLENBQUM7SUFDTixDQUFDO0lBRUQsbUVBQW1FO0lBQ25FLG9DQUFvQztJQUNwQyxpQkFBaUI7UUFDYixLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNWLElBQUksRUFBRSxJQUFJO2dCQUNWLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDckIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2FBQzFCLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFnQyxFQUFFLE1BQWM7UUFDeEQsSUFBSSxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQ3hCLE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQUEsQ0FBQztJQUVGLE1BQU07UUFDRixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRXpCLElBQUksWUFBWSxHQUFtQjtZQUMvQixRQUFRLEVBQUUsS0FBSztZQUNmLFVBQVUsRUFBRSxRQUFRO1NBQ3ZCLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxLQUFLLGNBQWMsRUFBRTtZQUN4QyxZQUFZLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQztTQUM5RDtRQUVELE9BQU8sQ0FDSCxvQkFBQyxrQkFBUSxJQUNMLFlBQVksRUFBRSxZQUFZLEVBQzFCLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFDckIsZ0JBQWdCLEVBQUUsSUFBSSxFQUN0QixPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsRUFDM0QsWUFBWSxFQUFFO2dCQUNWLGtCQUFrQixFQUFFLFlBQVk7YUFDbkMsRUFDRCxPQUFPLEVBQUUsOEJBQU0sRUFBRSxFQUFDLFlBQVksSUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBUSxFQUMxRCxNQUFNLEVBQUU7Z0JBQ0osb0JBQUMsb0JBQVUsSUFDUCxHQUFHLEVBQUMsT0FBTyxnQkFDQSxPQUFPLEVBQ2xCLEtBQUssRUFBQyxTQUFTLEVBQ2YsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUM5QixPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztvQkFDN0Msb0JBQUMsZUFBUyxJQUFDLEtBQUssRUFBQyxXQUFXLEdBQUcsQ0FDdEI7YUFDaEIsR0FDSCxDQUNMLENBQUM7SUFDTixDQUFDO0NBQ0o7QUFFRCxrQkFBZSxtQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDIn0=