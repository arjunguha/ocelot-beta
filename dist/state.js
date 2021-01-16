"use strict";
/**
 * This module stores the global state of Ocelot.
 *
 * The simplest approach would be to have several global variables. However,
 * we would need to implement our own mechanism to propagate state changes to
 * the UI.
 *
 * An alternative approach is to use Redux, but let's not do that. :)
 *
 * Instead, this module uses RxJS, which provides a lightweight mechanism
 * to subscribe to state changes.
 *
 * The following statement creates a new variable:
 *
 *   const myVariable = new Rx.BehaviorSubject(initialValue);
 *
 * To update the variable, use the .next method:
 *
 *   myVariable.next(newValue)
 *
 * To read the value in the variable, use the .getValue method:
 *
 *   myVariable.getValue()
 *
 * RxJS lets us subscribe to updates:
 *
 *   myVariable.observe(nextValue => print('Updated to ', nextValue);
 *
 * Therefore, if some portion of the view depends on myVariable, we can update
 * the view within callback passed to .observe. Unfortunately, we are using React,
 * which does not support imperative updates. However, we can reflect the
 * value of variable into the state of a component and then let the component
 * rely on the state:
 *
 *   myVariable.observe(nextValue => this.setState({ myVariableReflected: nextValue });
 *
 * The only caveat is that we cannot call setState on a component that is not
 * mounted, so the call above should be in the .componentDidMount method of
 * the React component.
 *
 * RxJS offers a lot more than just the ability to observe variable updates.
 * There are a bunch of tutorials online. Flapjax implements very similar
 * operations:
 *
 * https://people.cs.umass.edu/~arjun//papers/2009-meyerovich-oopsla.html
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.notify = exports.email = exports.currentFileName = exports.notification = exports.loadProgram = exports.githubGist = exports.uiActive = exports.loggedIn = exports.dirty = exports.files = exports.currentProgram = exports.emptyFile = void 0;
const Rx = require("rxjs");
exports.emptyFile = {
    name: 'untitled.js',
    content: ''
};
exports.currentProgram = new Rx.BehaviorSubject(Object.assign({ kind: 'program' }, exports.emptyFile));
exports.files = new Rx.BehaviorSubject([exports.emptyFile.name]);
// This state is set in several places: (1) the editor sets it to dirty,
// (2) the autosaver sets it to saving and saved.
exports.dirty = new Rx.BehaviorSubject('saved');
// This is set by the login/logout button.
exports.loggedIn = new Rx.BehaviorSubject({ kind: 'logged-out' });
// Derived from loggedIn
exports.uiActive = new Rx.BehaviorSubject(false);
exports.githubGist = new Rx.BehaviorSubject('no-gist');
function isUiActive(loggedIn) {
    return loggedIn.kind === 'logged-in';
}
exports.loggedIn.subscribe(x => exports.uiActive.next(isUiActive(x)));
////////////////////////////////////////////////////////////////////////////////
// Channels to communicate across components
// Send values to this subject to have the editor load a new program. Do not
// send values when the code in the editor changes. This is not a
// BehaviorSubject, because the last value it receives may not be the current
// state of a file.
exports.loadProgram = new Rx.Subject();
// Send values to this subject to display a little notification.
exports.notification = new Rx.Subject();
////////////////////////////////////////////////////////////////////////////////
// Convenient functions
function currentFileName() {
    const f = exports.currentProgram.getValue();
    if (f.kind !== 'program') {
        return '';
    }
    return f.name;
}
exports.currentFileName = currentFileName;
function email() {
    const f = exports.loggedIn.getValue();
    if (f.kind === 'logged-out') {
        return false;
    }
    return f.email;
}
exports.email = email;
function notify(message) {
    exports.notification.next({ position: 'top', message });
}
exports.notify = notify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOENHOzs7QUFFSCwyQkFBMkI7QUFXZCxRQUFBLFNBQVMsR0FBRztJQUNyQixJQUFJLEVBQUUsYUFBYTtJQUNuQixPQUFPLEVBQUUsRUFBRTtDQUNkLENBQUM7QUFjVyxRQUFBLGNBQWMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxlQUFlLGlCQUNoRCxJQUFJLEVBQUUsU0FBUyxJQUNaLGlCQUFTLEVBQ2QsQ0FBQztBQUVVLFFBQUEsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBVyxDQUFDLGlCQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUV4RSx3RUFBd0U7QUFDeEUsaURBQWlEO0FBQ3BDLFFBQUEsS0FBSyxHQUFHLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBUSxPQUFPLENBQUMsQ0FBQztBQUU1RCwwQ0FBMEM7QUFDN0IsUUFBQSxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFXLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7QUFFakYsd0JBQXdCO0FBQ1gsUUFBQSxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFVLEtBQUssQ0FBQyxDQUFDO0FBRWxELFFBQUEsVUFBVSxHQUFHLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBYSxTQUFTLENBQUMsQ0FBQztBQUV4RSxTQUFTLFVBQVUsQ0FBQyxRQUFrQjtJQUNsQyxPQUFPLFFBQVEsQ0FBQyxJQUFJLEtBQUssV0FBVyxDQUFDO0FBQ3pDLENBQUM7QUFFRCxnQkFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFdEQsZ0ZBQWdGO0FBQ2hGLDRDQUE0QztBQUU1Qyw0RUFBNEU7QUFDNUUsaUVBQWlFO0FBQ2pFLDZFQUE2RTtBQUM3RSxtQkFBbUI7QUFDTixRQUFBLFdBQVcsR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQVcsQ0FBQztBQUVyRCxnRUFBZ0U7QUFDbkQsUUFBQSxZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFnQixDQUFDO0FBRTNELGdGQUFnRjtBQUNoRix1QkFBdUI7QUFFdkIsU0FBZ0IsZUFBZTtJQUMzQixNQUFNLENBQUMsR0FBRyxzQkFBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7UUFDdEIsT0FBTyxFQUFFLENBQUM7S0FDYjtJQUNELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNsQixDQUFDO0FBTkQsMENBTUM7QUFFRCxTQUFnQixLQUFLO0lBQ2pCLE1BQU0sQ0FBQyxHQUFHLGdCQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUIsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFlBQVksRUFBRTtRQUN6QixPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUNELE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUNuQixDQUFDO0FBTkQsc0JBTUM7QUFFRCxTQUFnQixNQUFNLENBQUMsT0FBZTtJQUNsQyxvQkFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRkQsd0JBRUMifQ==