var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from "react";
import { Layout, Menu, Icon } from "antd";
import { Link } from "react-router-dom";
import "./Sidebar.less";
var Sidebar = /** @class */ (function (_super) {
    __extends(Sidebar, _super);
    function Sidebar(props) {
        var _this = _super.call(this, props) || this;
        _this.toggle = function () {
            _this.setState({
                collapsed: !_this.state.collapsed,
                mode: !_this.state.collapsed ? "vertical" : "inline",
            });
        };
        _this.state = {
            collapsed: false,
            mode: "inline",
        };
        return _this;
    }
    Sidebar.prototype.render = function () {
        return (React.createElement(Layout.Sider, { collapsible: true, collapsed: this.state.collapsed, onCollapse: this.toggle },
            React.createElement("div", { className: "ant-layout-logo" }),
            React.createElement(Menu, { theme: "dark", mode: this.state.mode, defaultSelectedKeys: ["1"] },
                React.createElement(Menu.Item, { key: "1" },
                    React.createElement(Link, { to: "/home" },
                        React.createElement(Icon, { type: "home" }),
                        React.createElement("span", { className: "nav-text" }, "Home"))),
                React.createElement(Menu.Item, { key: "2" },
                    React.createElement(Link, { to: "/todo" },
                        React.createElement(Icon, { type: "check-square-o" }),
                        React.createElement("span", { className: "nav-text" }, "Todo"))),
                React.createElement(Menu.Item, { key: "3" },
                    React.createElement(Link, { to: "/about" },
                        React.createElement(Icon, { type: "file" }),
                        React.createElement("span", { className: "nav-text" }, "About")))),
            React.createElement("div", { className: "sider-trigger" },
                React.createElement(Icon, { className: "trigger", type: this.state.collapsed ? "menu-unfold" : "menu-fold", onClick: this.toggle }))));
    };
    return Sidebar;
}(React.Component));
export default Sidebar;
//# sourceMappingURL=Sidebar.js.map