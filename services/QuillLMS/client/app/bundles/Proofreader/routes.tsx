import * as React from "react";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import Admin from "./components/admin/admin";
import PageLayout from "./components/PageLayout";
import PlayProofreader from "./components/proofreaderActivities/container";

export const routes: RouteConfig[] = [
  {
    path: "/play/pf",
    component: () => (<PlayProofreader />)
  },
  {
    path: "/admin",
    component: () => (<Admin />)
  }
];

export const route = (
  <Switch>
    <Route component={PageLayout} path="/" />
  </Switch>
);
