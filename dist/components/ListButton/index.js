"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ListItem_1 = require("@material-ui/core/ListItem");
const ListItemIcon_1 = require("@material-ui/core/ListItemIcon");
const ItemTypography_1 = require("../ItemTypography");
const styles_1 = require("@material-ui/core/styles");
const styles = theme => ({
    listItemColor: {
        color: theme.palette.primary.contrastText,
        opacity: 0.85,
    }
});
const ListItemButton = ({ icon, text, classes }) => (React.createElement(ListItem_1.default, { button: true },
    React.createElement(ListItemIcon_1.default, { className: classes.listItemColor }, icon),
    React.createElement(ItemTypography_1.default, { text: text, className: classes.listItemColor })));
exports.default = styles_1.withStyles(styles)(ListItemButton);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9MaXN0QnV0dG9uL2luZGV4LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUErQjtBQUMvQix5REFBa0Q7QUFDbEQsaUVBQTBEO0FBQzFELHNEQUErQztBQUUvQyxxREFBc0Y7QUFFdEYsTUFBTSxNQUFNLEdBQXVCLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QyxhQUFhLEVBQUU7UUFDWCxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWTtRQUN6QyxPQUFPLEVBQUUsSUFBSTtLQUNoQjtDQUNKLENBQUMsQ0FBQztBQU9ILE1BQU0sY0FBYyxHQUNkLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUMzQixvQkFBQyxrQkFBUSxJQUFDLE1BQU07SUFDWixvQkFBQyxzQkFBWSxJQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsYUFBYSxJQUN6QyxJQUFJLENBQ007SUFDZixvQkFBQyx3QkFBYyxJQUNYLElBQUksRUFBRSxJQUFJLEVBQ1YsU0FBUyxFQUFFLE9BQU8sQ0FBQyxhQUFhLEdBQ2xDLENBQ0ssQ0FDZCxDQUFDO0FBRU4sa0JBQWUsbUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyJ9