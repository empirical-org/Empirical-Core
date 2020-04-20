import * as React from "react";
import { RouteConfig } from "react-router-config";
import Admin from "./components/admin/admin"

export const routes: RouteConfig[] = [
  {
    path: "/admin",
    component: () => (<Admin />)
  }
];