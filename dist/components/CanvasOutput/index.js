"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styles_1 = require("@material-ui/core/styles");
// import defaultImage from '../../static/img/defaultCanvasImage.jpg';
const react_resize_detector_1 = require("react-resize-detector");
require("static/styles/Scrollbar.css");
// import Typography from '@material-ui/core/Typography';
const styles = theme => ({
    root: {
        background: theme.palette.primary.main,
        width: '100%',
        height: '100%',
    },
    canvasArea: {
        width: '100%',
        // display: 'flex', // this is for empty state
        // flexDirection: 'column',
        // alignItems: 'center', /* Vertical center alignment */
        // justifyContent: 'center', /* Horizontal center alignment */
        height: '100%',
        overflowY: 'auto',
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 4,
        right: theme.spacing.unit * 4,
    },
    icon: {
        fontSize: '12em',
        color: theme.palette.primary.contrastText,
        opacity: 0.7,
    }
});
class CanvasOutput extends React.Component {
    constructor(props) {
        super(props);
        this.onResize = () => {
        };
    }
    componentDidMount() {
        let canvasesElement = document.getElementById('canvases');
        if (canvasesElement === null) {
            return;
        }
        const config = { childList: true };
        const onUpdate = (mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type !== 'childList' || canvasesElement === null) {
                    continue;
                }
                canvasesElement.scrollTop = canvasesElement.scrollHeight;
                while (canvasesElement.childElementCount > 5) {
                    canvasesElement.removeChild(canvasesElement.firstChild);
                }
            }
        };
        let observer = new MutationObserver(onUpdate);
        observer.observe(canvasesElement, config);
    }
    render() {
        const { classes } = this.props;
        return (React.createElement("div", { className: classes.root, id: "canvasOutput" },
            React.createElement(react_resize_detector_1.default, { handleWidth: true, handleHeight: true, onResize: this.onResize }),
            React.createElement("div", { id: "canvases", className: `${classes.canvasArea} scrollbars` })));
    }
}
exports.default = styles_1.withStyles(styles)(CanvasOutput);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9DYW52YXNPdXRwdXQvaW5kZXgudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQStCO0FBQy9CLHFEQUFzRjtBQUN0RixzRUFBc0U7QUFDdEUsaUVBQXdEO0FBQ3hELHVDQUFxQztBQUNyQyx5REFBeUQ7QUFFekQsTUFBTSxNQUFNLEdBQXVCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QyxJQUFJLEVBQUU7UUFDRixVQUFVLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSTtRQUN0QyxLQUFLLEVBQUUsTUFBTTtRQUNiLE1BQU0sRUFBRSxNQUFNO0tBQ2pCO0lBQ0QsVUFBVSxFQUFFO1FBQ1IsS0FBSyxFQUFFLE1BQU07UUFDYiw4Q0FBOEM7UUFDOUMsMkJBQTJCO1FBQzNCLHdEQUF3RDtRQUN4RCw4REFBOEQ7UUFDOUQsTUFBTSxFQUFFLE1BQU07UUFDZCxTQUFTLEVBQUUsTUFBTTtLQUNwQjtJQUNELEdBQUcsRUFBRTtRQUNELFFBQVEsRUFBRSxVQUFVO1FBQ3BCLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDO1FBQzlCLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFDO0tBQ2hDO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsUUFBUSxFQUFFLE1BQU07UUFDaEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVk7UUFDekMsT0FBTyxFQUFFLEdBQUc7S0FDZjtDQUNKLENBQUMsQ0FBQztBQUlILE1BQU0sWUFBYSxTQUFRLEtBQUssQ0FBQyxTQUFvQjtJQUNqRCxZQUFZLEtBQVk7UUFDcEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBeUJqQixhQUFRLEdBQUcsR0FBRyxFQUFFO1FBQ2hCLENBQUMsQ0FBQztJQXpCRixDQUFDO0lBRUQsaUJBQWlCO1FBQ2IsSUFBSSxlQUFlLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxRCxJQUFJLGVBQWUsS0FBSyxJQUFJLEVBQUU7WUFDMUIsT0FBTztTQUNWO1FBQ0QsTUFBTSxNQUFNLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUE7UUFDbEMsTUFBTSxRQUFRLEdBQXFCLENBQUMsYUFBK0IsRUFBRSxFQUFFO1lBQ25FLEtBQUssSUFBSSxRQUFRLElBQUksYUFBYSxFQUFFO2dCQUNoQyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssV0FBVyxJQUFJLGVBQWUsS0FBSyxJQUFJLEVBQUU7b0JBQzNELFNBQVM7aUJBQ1o7Z0JBQ0QsZUFBZSxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUMsWUFBWSxDQUFDO2dCQUN6RCxPQUFPLGVBQWUsQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUU7b0JBQzFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLFVBQWtCLENBQUMsQ0FBQztpQkFDbkU7YUFDSjtRQUNMLENBQUMsQ0FBQTtRQUVELElBQUksUUFBUSxHQUFHLElBQUksZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUtELE1BQU07UUFDRixNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMvQixPQUFPLENBQ0gsNkJBQ0ksU0FBUyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQ3ZCLEVBQUUsRUFBQyxjQUFjO1lBRWpCLG9CQUFDLCtCQUFtQixJQUFDLFdBQVcsUUFBQyxZQUFZLFFBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUk7WUFDekUsNkJBQUssRUFBRSxFQUFDLFVBQVUsRUFBQyxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxhQUFhLEdBQUksQ0FDbEUsQ0FDVCxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBRUQsa0JBQWUsbUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyJ9