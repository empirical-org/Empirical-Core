import * as React from "react";
import { RouteConfig } from "react-router-config";
import { Route, Switch } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import PlayGrammar from "./components/grammarActivities/container";
import Admin from "./components/admin/admin";

export const routes: RouteConfig[] = [
    {
      path: "/play/sw",
      component: (props: any) => (<PlayGrammar questionToPreview={props.questionToPreview} previewMode={props.previewMode}/>)
    },
    {
      path: "/admin",
      component: () => (<Admin />)
    },
    {
      path: "/turk",
      component: () => (<PlayGrammar />)
    }
];

export const route = (
  <Switch>
    <Route component={PageLayout} path="/" />
  </Switch>
);
