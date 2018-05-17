import * as React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import { Header } from "./Header";
import { Redirect } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { routes } from "../routes";
import "./PageLayout.less";
var PageLayout = function () {
    return (React.createElement(Layout, { className: "ant-layout-has-sider" },
        React.createElement(Sidebar, null),
        React.createElement(Layout, null,
            React.createElement(Layout.Content, null,
                React.createElement(Header, null),
                React.createElement(Redirect, { to: "/home" }),
                renderRoutes(routes)))));
};
export default PageLayout;
//# sourceMappingURL=PageLayout.js.map