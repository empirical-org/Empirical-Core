import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CompatRouter } from "react-router-dom-v5-compat";

import TutorialIndex from '../components/tutorials/TutorialIndex';

const TutorialsRouter = () => {
  return (
    <BrowserRouter>
      <CompatRouter>
        <Switch>
          <Route component={TutorialIndex} path="/tutorials/:tool/:slideNumber" />
          <Route component={TutorialIndex} path="/tutorials/:tool" />
          <Route component={TutorialIndex} path="/tutorials" />
        </Switch>
      </CompatRouter>
    </BrowserRouter>
  );
};

export default TutorialsRouter;
