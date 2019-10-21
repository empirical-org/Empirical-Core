import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import TutorialIndex from '../components/tutorials/TutorialIndex';

export default React.createClass({
  render() {
    return (
      <Router history={browserHistory}>
        <Route component={TutorialIndex} path="/tutorials">
          <IndexRoute component={TutorialIndex} />
          <Route component={TutorialIndex} path=":tool" />
          <Route component={TutorialIndex} path=":tool/:slideNumber" />
        </Route>
      </Router>
    );
  },
});
