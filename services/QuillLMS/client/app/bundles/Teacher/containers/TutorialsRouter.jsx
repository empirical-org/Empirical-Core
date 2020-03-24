import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import TutorialIndex from '../components/tutorials/TutorialIndex';

export default class TutorialsRouter extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route component={TutorialIndex} path="/tutorials/:tool/:slideNumber" />
          <Route component={TutorialIndex} path="/tutorials/:tool" />
          <Route component={TutorialIndex} path="/tutorials" />
        </Switch>
      </Router>
    );
  }
}
