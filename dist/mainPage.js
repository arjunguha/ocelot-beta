"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Index = void 0;
const React = require("react");
const withStyles_1 = require("@material-ui/core/styles/withStyles");
const CustomTheme_1 = require("./components/CustomTheme");
const JumboContent = require("./JumboContent");
const sandbox_1 = require("./sandbox");
const detect_browser_1 = require("detect-browser");
require("static/styles/JumboContent.css");
require("static/styles/body.css");
const Typography_1 = require("@material-ui/core/Typography");
const state = require("./state");
const getGithubGist_1 = require("./utils/api/getGithubGist");
const apiHelpers_1 = require("./utils/api/apiHelpers");
const styles = theme => {
    return {
        root: {
            flexGrow: 1,
            height: '100vh',
            width: '100vw',
            zIndex: 1,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            backgroundColor: theme.palette.primary.main,
        },
        jumboContainer: {
            display: 'flex',
            flexFlow: 'column',
            height: '100%',
        },
        jumboContent: {
            position: 'relative',
            height: '100%',
            flex: '1 1 auto',
        },
        toolbar: Object.assign(Object.assign({}, theme.mixins.toolbar), { flex: '0 1 auto' }),
    };
};
const checkAndLoadGist = () => {
    const gistParam = (new URLSearchParams(window.location.search)).get('gist');
    if (typeof gistParam === 'string') {
        state.githubGist.next('loading-gist');
        state.notify('Loading Github gist...');
        getGithubGist_1.getGithubGist(gistParam).then((res => {
            if (apiHelpers_1.isFailureResponse(res)) {
                state.notify(res.data.message);
                state.githubGist.next('failed-gist');
                return;
            }
            const gistFileObj = { name: 'gist.js', content: res.data.code };
            state.files.next([gistFileObj.name]);
            state.loadProgram.next(Object.assign({ kind: "program" }, gistFileObj));
            state.githubGist.next('loaded-gist');
            state.notify('Gist loaded');
        }));
    }
};
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allLibsLoaded: 'waiting'
        };
    }
    componentDidMount() {
        sandbox_1.loadLibraries().then(() => {
            this.setState({
                allLibsLoaded: 'ready'
            });
            checkAndLoadGist();
        }, (err) => {
            console.error(`Could not load libraries: ${JSON.stringify(err)}.`);
            this.setState({
                allLibsLoaded: 'failed'
            });
        });
    }
    render() {
        const browser = detect_browser_1.detect();
        switch (browser && browser.name) {
            case 'chrome':
            case 'firefox':
            case 'safari':
            case 'ios':
                switch (this.state.allLibsLoaded) {
                    case 'waiting':
                        return (React.createElement(Typography_1.default, { variant: "display1", align: "center" }, "Loading..."));
                    case 'failed':
                        return (React.createElement(Typography_1.default, { variant: "display1", align: "center" }, "Failed; try to refesh the page."));
                    default: //ready
                        const { classes } = this.props;
                        return (React.createElement(JumboContent.JumboContentDefault, { classes: classes }));
                }
            default:
                return (React.createElement(Typography_1.default, { variant: "display1", align: "center" }, "Your browser is unsupported; please use Chrome, Firefox, or Safari."));
        }
    }
}
exports.Index = Index;
exports.default = CustomTheme_1.default(withStyles_1.default(styles)(Index));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpblBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWFpblBhZ2UudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUErQjtBQUMvQixvRUFBa0c7QUFDbEcsMERBQW1EO0FBQ25ELCtDQUErQztBQUMvQyx1Q0FBMEM7QUFDMUMsbURBQXdDO0FBQ3hDLDBDQUF3QztBQUN4QyxrQ0FBZ0M7QUFDaEMsNkRBQXNEO0FBQ3RELGlDQUFpQztBQUNqQyw2REFBMEQ7QUFDMUQsdURBQTJEO0FBRzNELE1BQU0sTUFBTSxHQUF1QixLQUFLLENBQUMsRUFBRTtJQUN6QyxPQUFPO1FBQ0wsSUFBSSxFQUFFO1lBQ0osUUFBUSxFQUFFLENBQUM7WUFDWCxNQUFNLEVBQUUsT0FBTztZQUNmLEtBQUssRUFBRSxPQUFPO1lBQ2QsTUFBTSxFQUFFLENBQUM7WUFDVCxRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsVUFBVTtZQUNwQixPQUFPLEVBQUUsTUFBTTtZQUNmLGVBQWUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJO1NBQzVDO1FBQ0QsY0FBYyxFQUFFO1lBQ2QsT0FBTyxFQUFFLE1BQU07WUFDZixRQUFRLEVBQUUsUUFBUTtZQUNsQixNQUFNLEVBQUUsTUFBTTtTQUNmO1FBQ0QsWUFBWSxFQUFFO1lBQ1osUUFBUSxFQUFFLFVBQVU7WUFDcEIsTUFBTSxFQUFFLE1BQU07WUFDZCxJQUFJLEVBQUUsVUFBVTtTQUNqQjtRQUNELE9BQU8sa0NBQ0YsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQ3ZCLElBQUksRUFBRSxVQUFVLEdBQ2pCO0tBQ0YsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxFQUFFO0lBQzVCLE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdB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