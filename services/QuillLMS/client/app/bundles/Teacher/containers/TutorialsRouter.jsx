import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import TutorialIndex from '../components/tutorials/TutorialIndex';

const TutorialsRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={TutorialIndex} path="/tutorials/:tool/:slideNumber" />
        <Route component={TutorialIndex} path="/tutorials/:tool" />
        <Route component={TutorialIndex} path="/tutorials" />
      </Switch>
    </BrowserRouter>
  );
};

export default TutorialsRouter;
