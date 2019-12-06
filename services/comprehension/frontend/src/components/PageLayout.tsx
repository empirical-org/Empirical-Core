import * as React from "react";
import Header from "./Header";
import { Redirect } from "react-router-dom";
import {renderRoutes} from "react-router-config";
import { routes } from "../routes";

const PageLayout: React.StatelessComponent<{}> = () => {
    return (
      <div className="app-container">
        <Header />
        {renderRoutes(routes)}
      </div>
    );
};

export default PageLayout;
