"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Typography_1 = require("@material-ui/core/Typography");
const validateUser_1 = require("./utils/api/validateUser");
const apiHelpers_1 = require("./utils/api/apiHelpers");
const state = require("./state");
const utils = require("./utils");
const secrets_1 = require("./secrets");
const Fade_1 = require("@material-ui/core/Fade");
const react_google_login_1 = require("react-google-login");
const Button_1 = require("@material-ui/core/Button");
const react_google_login_2 = require("react-google-login");
const reactrx_1 = require("./reactrx");
require("./static/styles/body.css");
const alternateLogoutButton = (onClickProp) => {
    return !onClickProp ? (React.createElement(Button_1.default, { color: "inherit" }, "Logout")) : (React.createElement(Button_1.default, { color: "inherit", onClick: onClickProp.onClick },
        React.createElement(Typography_1.default, { color: "inherit", variant: "button" }, "Sign Out")));
}, alternateLoginButton = (onClickProp) => {
    return !onClickProp ? (React.createElement(Button_1.default, { color: "inherit" }, "Login")) : (React.createElement(Button_1.default, { color: "inherit", onClick: onClickProp.onClick },
        React.createElement(Typography_1.default, { color: "inherit", variant: "button" }, "Login with Google")));
};
/**
 * A GoogleLogoutButton (a stateless component)
 *
 * @param {GoogleLogoutButtonProps} props
 * @returns {JSX.Element} a Logout button
 */
function GoogleLogoutButton(props) {
    const { show } = props;
    return (React.createElement(Fade_1.default, { in: show },
        React.createElement("div", { style: { display: (show ? 'inline-block' : 'none') } },
            React.createElement(react_google_login_2.GoogleLogout, { onLogoutSuccess: props.onClick, render: alternateLogoutButton }))));
}
class LoginLogout extends React.Component {
    constructor(props) {
        super(props);
        this.loadFiles = () => {
            utils.postJson('listfiles', {})
                .then(files => {
                state.files.next(files);
                const email = state.email();
                if (email === false) { // This case is hit if user immediately logs out after logging in.
                    this.onLogout();
                    return;
                }
                state.loggedIn.next({ kind: 'logged-in', email });
                state.loadProgram.next({ kind: "nothing" });
            })
                .catch(reason => 
            // TODO(arjun): Perhaps just retry?
            state.notify(`Could not load files`));
        };
        this.onFailure = (response) => {
            state.notification.next({ message: response.error, position: 'top' });
            this.onLogout();
        };
        this.state = {
            loggedIn: state.loggedIn.getValue(),
            loading: false
        };
        reactrx_1.connect(this, 'loggedIn', state.loggedIn);
    }
    onSuccess(response) {
        if (state.githubGist.getValue() !== 'no-gist' && localStorage.getItem('userEmail') !== null) {
            // if there is gist (or an attempt) and user is logged in before...
            state.githubGist.next('no-gist');
            return; // this prevents auto log in
        }
        validateUser_1.validateUser(response).then((response) => {
            if (apiHelpers_1.isFailureResponse(response)) {
                state.notify(response.data.message);
                this.onLogout();
                return;
            }
            state.loggedIn.next({
                kind: 'loading-files',
                email: response.data.email
            });
            this.loadFiles();
        }).catch(error => {
            state.notify('Could not log in. Check again');
            this.loadFiles();
        });
    }
    onLogout() {
        state.loggedIn.next({ kind: 'logged-out' });
        state.files.next([state.emptyFile.name]);
        state.loadProgram.next(Object.assign({ kind: "program" }, state.emptyFile));
        localStorage.removeItem('userEmail');
        localStorage.removeItem('sessionId');
    }
    render() {
        const loggedIn = this.state.loggedIn.kind !== 'logged-out';
        const email = this.state.loggedIn.kind !== 'logged-out' ? this.state.loggedIn.email : '';
        return ([
            React.createElement(Typography_1.default, { key: "email", id: loggedIn ? "userEmail" : "", variant: "subheading", color: "inherit" }, email),
            React.createElement(GoogleLogoutButton, { key: "logout", show: loggedIn, onClick: () => this.onLogout() }),
            React.createElement(react_google_login_1.GoogleLogin, { key: "login", style: { display: loggedIn ? 'none' : '' }, clientId: secrets_1.LOGIN_CLIENT_ID, onSuccess: (resp) => this.onSuccess(resp), onFailure: this.onFailure, prompt: "select_account" // always prompts user to select a specific account
                , isSignedIn: true, render: !loggedIn ? alternateLoginButton : undefined })
        ]);
    }
}
exports.default = LoginLogout;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW5CdXR0b24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbG9naW5CdXR0b24udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQStCO0FBRS9CLDZEQUFzRDtBQUN0RCwyREFBd0Q7QUFDeEQsdURBQTJEO0FBQzNELGlDQUFpQztBQUNqQyxpQ0FBaUM7QUFDakMsdUNBQTRDO0FBRTVDLGlEQUEwQztBQUMxQywyREFBa0Q7QUFDbEQscURBQThDO0FBRTlDLDJEQUFrRDtBQUNsRCx1Q0FBb0M7QUFFcEMsb0NBQWtDO0FBRWxDLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxXQUFxQyxFQUFFLEVBQUU7SUFDcEUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBQyxnQkFBTSxJQUFDLEtBQUssRUFBQyxTQUFTLGFBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDOUQsb0JBQUMsZ0JBQU0sSUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsT0FBTztRQUNoRCxvQkFBQyxvQkFBVSxJQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFDLFFBQVEsZUFBc0IsQ0FDN0QsQ0FDWixDQUFDO0FBQ04sQ0FBQyxFQUFFLG9CQUFvQixHQUFHLENBQUMsV0FBb0MsRUFBRSxFQUFFO0lBQy9ELE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsb0JBQUMsZ0JBQU0sSUFBQyxLQUFLLEVBQUMsU0FBUyxZQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDN0Qsb0JBQUMsZ0JBQU0sSUFBQyxLQUFLLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsT0FBTztRQUNoRCxvQkFBQyxvQkFBVSxJQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFDLFFBQVEsd0JBQStCLENBQ3RFLENBQ1osQ0FBQztBQUNOLENBQUMsQ0FBQztBQU1GOzs7OztHQUtH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