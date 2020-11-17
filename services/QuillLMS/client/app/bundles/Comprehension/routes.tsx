import * as React from "react";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import StudentView from './components/studentView/container';
import TurkerView from './components/turkerView';

export const routes: RouteConfig[] = [
  {
    path: "/play",
    component: (props: any) => (<StudentView {...props} />)
  },
  {
    path: "/turk",
    component: (props: any) => (<TurkerView {...props} />)
  }
];

export const route = (
  <Switch>
    <Route component={PageLayout} path="/" />
  </Switch>
);
