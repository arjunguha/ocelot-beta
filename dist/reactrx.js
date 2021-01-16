"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
/**
 * Updates an element of the component's state whenever an observable changes.
 *
 * Use this function in the constructor of a component after initializing the
 * state. E.g.,
 *
 * this.state = { x: initialValue }; // Initial other elements here
 * connect(this, 'x', observableX);
 *
 */
function connect(component, key, observable) {
    const didMount = component.componentDidMount;
    const willUnmount = component.componentWillUnmount;
    let subscription;
    component.componentDidMount = () => {
        if (didMount) {
            didMount.call(component);
        }
        subscription = observable.subscribe(value => component.setState({ [key]: value }));
    };
    component.componentWillUnmount = () => {
        if (willUnmount) {
            willUnmount.call(component);
        }
        if (subscription) {
            subscription.unsubscribe();
            subscription = undefined;
        }
    };
}
exports.connect = connect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3RyeC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdHJ4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdBOzs7Ozs7Ozs7R0FTRztBQUNILFNBQWdCLE9BQU8sQ0FDbkIsU0FBZ0MsRUFDaEMsR0FBTSxFQUNOLFVBQTRCO0lBRTVCLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQztJQUM3QyxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsb0JBQW9CLENBQUM7SUFDbkQsSUFBSSxZQUF5QyxDQUFDO0lBRTlDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLEVBQUU7UUFDL0IsSUFBSSxRQUFRLEVBQUU7WUFDVixRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzVCO1FBQ0QsWUFBWSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FDeEMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUMsQ0FBQztJQUVGLFNBQVMsQ0FBQyxvQkFBb0IsR0FBRyxHQUFHLEVBQUU7UUFDbEMsSUFBSSxXQUFXLEVBQUU7WUFDYixXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxZQUFZLEVBQUU7WUFDZCxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDM0IsWUFBWSxHQUFHLFNBQVMsQ0FBQztTQUM1QjtJQUNMLENBQUMsQ0FBQztBQUNOLENBQUM7QUExQkQsMEJBMEJDIn0=