import React from 'react'
import { Route, Router, browserHistory } from 'react-router'
import Stages from '../components/diagnostic/diagnostic_questionnaire/Stages.jsx'
import SuccessView from '../components/diagnostic/diagnostic_questionnaire/SuccessView.jsx'
import App from '../components/diagnostic/diagnostic_questionnaire/index.jsx'

export default class extends React.Component {
  render() {

    return (
      <Router history={browserHistory}>
        <Route component={App} path="/diagnostic/:activityId/">
          <Route component={SuccessView} path='success' />
          <Route component={Stages} path='stage/:stage' />
        </Route>
      </Router>
    );
  }
}
