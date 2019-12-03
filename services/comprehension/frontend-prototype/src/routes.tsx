import * as React from "react";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import PageLayout from "./components/PageLayout";

export const routes: RouteConfig[] = [
    // {
    //   path: "/play/pf",
    //   component: () => (<PlayProofreader />)
    // },
    // {
    //   path: "/admin",
    //   component: () => (<Admin />)
    // }
];

export const route = (
  <Switch>
    <Route component={PageLayout} path="/" />
  </Switch>
);
