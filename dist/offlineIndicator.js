"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfflineIndicator = void 0;
const React = require("react");
const Typography_1 = require("@material-ui/core/Typography");
const state_1 = require("./state");
/**
 * A little component that shows "Offline" when the user is offline and
 * nothing when online. In addition, when transitioning to offline, it displays
 * a little notification. It does not display a notification when transitioning
 * to online.
 */
class OfflineIndicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = { online: window.navigator.onLine };
        this.onOfflineOnline = (e) => {
            if (window.navigator.onLine === false) {
                state_1.notify('Internet connection lost. No changes will be saved until you reconnect.');
            }
            this.setState({ online: window.navigator.onLine });
        };
    }
    componentDidMount() {
        window.addEventListener('online', this.onOfflineOnline);
        window.addEventListener('offline', this.onOfflineOnline);
    }
    componentWillUnmount() {
        window.removeEventListener('online', this.onOfflineOnline);
        window.removeEventListener('offline', this.onOfflineOnline);
    }
    render() {
        return React.createElement(Typography_1.default, { variant: "subheading", color: "error" }, this.state.online ? '' : 'offline');
    }
}
exports.OfflineIndicator = OfflineIndicator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmbGluZUluZGljYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vZmZsaW5lSW5kaWNhdG9yLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsNkRBQXNEO0FBQ3RELG1DQUFpQztBQUVqQzs7Ozs7R0FLRztBQUNILE1BQWEsZ0JBQWlCLFNBQVEsS0FBSyxDQUFDLFNBQWtDO0lBSTFFLFlBQVksS0FBUztRQUNqQixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakQsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQVEsRUFBRSxFQUFFO1lBQ2hDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFO2dCQUNuQyxjQUFNLENBQUMseUVBQXlFLENBQUMsQ0FBQzthQUNyRjtZQUNELElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxpQkFBaUI7UUFDYixNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN4RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsb0JBQW9CO1FBQ2hCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzNELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxNQUFNO1FBQ0YsT0FBTyxvQkFBQyxvQkFBVSxJQUFDLE9BQU8sRUFBQyxZQUFZLEVBQUMsS0FBSyxFQUFDLE9BQU8sSUFDaEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUMxQixDQUFDO0lBQ2xCLENBQUM7Q0FDSjtBQTlCRCw0Q0E4QkMifQ==