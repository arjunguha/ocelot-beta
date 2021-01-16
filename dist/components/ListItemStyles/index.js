"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const styles_1 = require("@material-ui/core/styles");
const styles = theme => ({
    nested: {
        paddingLeft: theme.spacing.unit * 4
    },
    listItemColor: {
        color: theme.palette.primary.contrastText,
        opacity: 0.9,
    },
    selectedHighlight: {
        backgroundColor: `${theme.palette.secondary.main}77`,
        '&:hover': {
            backgroundColor: `${theme.palette.secondary.main}77`,
        }
    },
    textField: {
        color: theme.palette.primary.contrastText,
        fontSize: 14
    },
    formControl: {
        width: '100%'
    },
    loadingIcon: {
        transition: theme.transitions.create('opacity', {
            easing: 'linear',
            duration: theme.transitions.duration.shorter,
        }),
        margin: '5px',
        opacity: 0,
    },
    codeIcon: {
        color: theme.palette.primary.contrastText,
        transition: theme.transitions.create('opacity', {
            easing: 'linear',
            duration: theme.transitions.duration.shorter
        }) + ', ' + theme.transitions.create('visibility', {
            easing: 'linear',
            duration: theme.transitions.duration.shorter
        }),
        visibility: 'hidden',
        opacity: 0,
    },
    show: {
        transition: theme.transitions.create('opacity', {
            easing: 'linear',
            duration: theme.transitions.duration.shorter
        }),
        opacity: 0.8,
        visibility: 'visible'
    },
    tinyPadding: {
        paddingTop: '3px',
        paddingBottom: '3px'
    },
    noButtonBackground: {
        '&:hover': {
            backgroundColor: '#ffffff00'
        }
    },
    closerTooltip: {
        margin: '0 0'
    }
});
exports.default = styles_1.withStyles(styles);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9MaXN0SXRlbVN0eWxlcy9pbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBMEU7QUFlMUUsTUFBTSxNQUFNLEdBQTRDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5RCxNQUFNLEVBQUU7UUFDSixXQUFXLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsQ0FBQztLQUN0QztJQUNELGFBQWEsRUFBRTtRQUNYLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZO1FBQ3pDLE9BQU8sRUFBRSxHQUFHO0tBQ2Y7SUFDRCxpQkFBaUIsRUFBRTtRQUNmLGVBQWUsRUFBRSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSTtRQUNwRCxTQUFTLEVBQUU7WUFDUCxlQUFlLEVBQUUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUk7U0FDdkQ7S0FDSjtJQUNELFNBQVMsRUFBRTtRQUNQLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZO1FBQ3pDLFFBQVEsRUFBRSxFQUFFO0tBQ2Y7SUFDRCxXQUFXLEVBQUU7UUFDVCxLQUFLLEVBQUUsTUFBTTtLQUNoQjtJQUNELFdBQVcsRUFBRTtRQUNULFVBQVUsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFDNUMsTUFBTSxFQUFFLFFBQVE7WUFDaEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU87U0FDL0MsQ0FBQztRQUNGLE1BQU0sRUFBRSxLQUFLO1FBQ2IsT0FBTyxFQUFFLENBQUM7S0FDYjtJQUNELFFBQVEsRUFBRTtRQUNOLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZO1FBQ3pDLFVBQVUsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFDNUMsTUFBTSxFQUFFLFFBQVE7WUFDaEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU87U0FDL0MsQ0FBQyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7WUFDL0MsTUFBTSxFQUFFLFFBQVE7WUFDaEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU87U0FDL0MsQ0FBQztRQUNGLFVBQVUsRUFBRSxRQUFRO1FBQ3BCLE9BQU8sRUFBRSxDQUFDO0tBQ2I7SUFDRCxJQUFJLEVBQUU7UUFDRixVQUFVLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQzVDLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLFFBQVEsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPO1NBQy9DLENBQUM7UUFDRixPQUFPLEVBQUUsR0FBRztRQUNaLFVBQVUsRUFBRSxTQUFTO0tBQ3hCO0lBQ0QsV0FBVyxFQUFFO1FBQ1QsVUFBVSxFQUFFLEtBQUs7UUFDakIsYUFBYSxFQUFFLEtBQUs7S0FDdkI7SUFDRCxrQkFBa0IsRUFBRTtRQUNoQixTQUFTLEVBQUM7WUFDTixlQUFlLEVBQUUsV0FBVztTQUMvQjtLQUNKO0lBQ0QsYUFBYSxFQUFFO1FBQ1gsTUFBTSxFQUFFLEtBQUs7S0FDaEI7Q0FFSixDQUFDLENBQUM7QUFFSCxrQkFBZSxtQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDIn0=