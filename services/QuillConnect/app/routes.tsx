import * as React from "react";
import { RouteConfig } from "react-router-config";
import Admin from "./components/admin/admin"
import Lesson from "./components/studentLessons/lesson"
import Turk from './components/turk/turkActivity.jsx';

export const routes: RouteConfig[] = [
  {
    path: "/admin",
    component: () => (<Admin />)
  },
  {
    path: "/play/lesson/:lessonID",
    component: () => (<Lesson />)
  },
  {
    path: "/turk/:lessonID",
    component: () => (<Turk />)
  }
];