import * as React from "react";
import {renderRoutes} from "react-router-config";

import Header from "./Header";

import { routes } from "../routes";

const PageLayout: React.StatelessComponent<{}> = (props: any) => {
  const { user } = props;
    return (
      <div aria-live="polite" className="app-container">
        <Header />
        {renderRoutes(routes, { user })}
      </div>
    );
};

export default PageLayout;
