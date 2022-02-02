import * as React from "react";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import PlayGrammar from "./components/grammarActivities/container";
import Admin from "./components/admin/admin";

export const routes: RouteConfig[] = [
  {
    path: "/play/sw",
    component: (props: any) => (<PlayGrammar {...props} />)
  },
  {
    path: "/admin",
    component: (props) => (<Admin {...props} />)
  },
  {
    path: "/turk",
    component: (props) => (<PlayGrammar {...props} />)
  }
];

export const route = (
  <Switch>
    <Route component={PageLayout} path="/" />
  </Switch>
);
