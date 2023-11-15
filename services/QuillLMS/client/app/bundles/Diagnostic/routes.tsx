import * as React from "react";
import { RouteConfig } from "react-router-config";

import Admin from "./components/admin/admin";
import DiagnosticRouter from "./components/shared/diagnosticRouter";

export const routes: RouteConfig[] = [
  {
    path: "/admin",
    component: () => (<Admin />)
  },
  {
    path: "/play/diagnostic/:diagnosticID",
    component: (props: any) => (<DiagnosticRouter {...props} />)
  },
  {
    path: "/turk/:diagnosticID",
    component: (props: any) => (<DiagnosticRouter {...props} />)
  }
];
