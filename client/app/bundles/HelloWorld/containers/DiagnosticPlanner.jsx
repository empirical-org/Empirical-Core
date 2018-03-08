import React from 'react'
import createReactClass from 'create-react-class'
import { Router, Route, Link, browserHistory } from 'react-router'
import App from '../components/diagnostic/diagnostic_questionnaire/index.jsx'
import Stages from '../components/diagnostic/diagnostic_questionnaire/Stages.jsx'
import SuccessView from '../components/diagnostic/diagnostic_questionnaire/SuccessView.jsx'

export default createReactClass({

  render: function () {

      return (
        <Router history={browserHistory}>
          <Route path="/diagnostic/:activityId/" component={App}>
            <Route path='success' component={SuccessView}/>
            <Route path='stage/:stage' component={Stages}/>
          </Route>
        </Router>
      );
  }
});
