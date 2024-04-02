import * as React from "react";
import { RouteConfig } from "react-router-config";
import Admin from "./components/admin/admin";
import Customize from "./components/customize/customize";
import TeacherRoot from './components/root';
import StudentRoot from "./components/studentRoot";

export const routes: RouteConfig[] = [
  {
    path: "/admin",
    component: () => (<Admin />)
  },
  {
    path: "/customize",
    component: () => (<Customize />)
  },
  {
    path: "/play",
    component: () => (<StudentRoot />)
  },
  {
    path: "/teach",
    component: () => (<TeacherRoot />)
  }
];
