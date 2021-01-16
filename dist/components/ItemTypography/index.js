"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ListItemText_1 = require("@material-ui/core/ListItemText");
const Typography_1 = require("@material-ui/core/Typography");
const ItemTypography = ({ text, className, styleBody = false }) => (React.createElement(ListItemText_1.default, { disableTypography: true, primary: React.createElement(Typography_1.default, { variant: styleBody ? 'body1' : 'subheading', className: className }, text), classes: { root: className } }));
exports.default = ItemTypography;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9JdGVtVHlwb2dyYXBoeS9pbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBK0I7QUFDL0IsaUVBQTBEO0FBQzFELDZEQUFzRDtBQUl0RCxNQUFNLGNBQWMsR0FBb0MsQ0FBQyxFQUNwRCxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsR0FBRyxLQUFLLEVBQ2xDLEVBQUUsRUFBRSxDQUFDLENBQ04sb0JBQUMsc0JBQVksSUFDVCxpQkFBaUIsUUFDakIsT0FBTyxFQUNILG9CQUFDLG9CQUFVLElBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsU0FBUyxFQUFFLFNBQVMsSUFDeEUsSUFBSSxDQUNJLEVBQ2pCLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FDOUIsQ0FDTCxDQUFDO0FBRUYsa0JBQWUsY0FBYyxDQUFDIn0=