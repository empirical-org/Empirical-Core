import * as React from "react";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import HomePage from "./components/HomePage";
// import { TodoPage } from "./components/TodoPage";
import AboutPage from "./components/AboutPage";
import PageLayout from "./layouts/PageLayout";
import PlayGrammar from "./components/grammarActivities/container"

export const routes: RouteConfig[] = [
    {
      path: "/play/sw",
      component: () => (<PlayGrammar />)
    },
    {
        path: "/home",
        exact: true,
        component: () => (<HomePage />),
    },
    // {
    //     path: "/todo",
    //     component: () => (<TodoPage />),
    // },
    {
        path: "/about",
        component: () => (<AboutPage />),
    },
];

export const route = (
    <Switch>
        <Route path="/" component={PageLayout} />
    </Switch>
);
