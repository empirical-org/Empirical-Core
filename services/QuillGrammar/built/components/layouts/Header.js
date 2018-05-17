import * as React from "react";
import { Layout, Row, Col, Menu, Icon } from "antd";
import { Link } from "react-router-dom";
import "./Header.less";
export var Header = function () {
    return (React.createElement(Layout.Header, { style: { background: "#fff", padding: 0 } },
        React.createElement(Row, { type: "flex", justify: "end", align: "middle" },
            React.createElement(Col, { span: 3 },
                React.createElement(Menu, { mode: "horizontal", className: "user-logout" },
                    React.createElement(Menu.SubMenu, { title: React.createElement("span", null,
                            React.createElement(Icon, { type: "user" }),
                            "User 1") },
                        React.createElement(Menu.Item, { key: "logOut" },
                            React.createElement(Link, { to: "#" }, "Logout"))))))));
};
//# sourceMappingURL=Header.js.map