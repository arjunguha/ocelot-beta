"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const styles_1 = require("@material-ui/core/styles");
const CssBaseline_1 = require("@material-ui/core/CssBaseline");
// A theme with custom primary and secondary color.
// It's optional.
const theme = styles_1.createMuiTheme({
    palette: {
        primary: {
            light: '#484848',
            main: '#212121',
            dark: '#000000',
            contrastText: '#fff',
        },
        secondary: {
            light: '#80d6ff',
            main: '#42a5f5',
            dark: '#0077c2',
            contrastText: '#fff',
        },
        type: 'dark'
    },
    zIndex: {
        drawer: 1,
        appBar: 2,
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
function CustomTheme(Component) {
    function customTheme(props) {
        // MuiThemeProvider makes the theme available down the React tree
        // thanks to React context.
        return (React.createElement(styles_1.MuiThemeProvider, { theme: theme },
            React.createElement(CssBaseline_1.default, null),
            React.createElement(Component, Object.assign({}, props))));
    }
    return customTheme;
}
exports.default = CustomTheme;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9DdXN0b21UaGVtZS9pbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBK0I7QUFDL0IscURBQTRFO0FBQzVFLCtEQUF3RDtBQUV4RCxtREFBbUQ7QUFDbkQsaUJBQWlCO0FBQ2pCLE1BQU0sS0FBSyxHQUFHLHVCQUFjLENBQUM7SUFDM0IsT0FBTyxFQUFFO1FBQ1AsT0FBTyxFQUFFO1lBQ1AsS0FBSyxFQUFFLFNBQVM7WUFDaEIsSUFBSSxFQUFFLFNBQVM7WUFDZixJQUFJLEVBQUUsU0FBUztZQUNmLFlBQVksRUFBRSxNQUFNO1NBQ3JCO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsS0FBSyxFQUFFLFNBQVM7WUFDaEIsSUFBSSxFQUFFLFNBQVM7WUFDZixJQUFJLEVBQUUsU0FBUztZQUNmLFlBQVksRUFBRSxNQUFNO1NBQ3JCO1FBQ0QsSUFBSSxFQUFFLE1BQU07S0FDYjtJQUNELE1BQU0sRUFBRTtRQUNOLE1BQU0sRUFBRSxDQUFDO1FBQ1QsTUFBTSxFQUFFLENBQUM7S0FDVjtJQUNELFNBQVMsRUFBRTtRQUNULFNBQVMsRUFBRztZQUNWLElBQUksRUFBRTtnQkFDSixXQUFXLEVBQUUsS0FBSztnQkFDbEIsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLFFBQVEsRUFBRSxLQUFLO2FBQ2hCO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILFNBQVMsV0FBVyxDQUFDLFNBQThCO0lBQ2pELFNBQVMsV0FBVyxDQUFDLEtBQWE7UUFDaEMsaUVBQWlFO1FBQ2pFLDJCQUEyQjtRQUMzQixPQUFPLENBQ0wsb0JBQUMseUJBQWdCLElBQUMsS0FBSyxFQUFFLEtBQUs7WUFFNUIsb0JBQUMscUJBQVcsT0FBRztZQUNmLG9CQUFDLFNBQVMsb0JBQUssS0FBSyxFQUFJLENBQ1AsQ0FDcEIsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDO0FBRUQsa0JBQWUsV0FBVyxDQUFDIn0=