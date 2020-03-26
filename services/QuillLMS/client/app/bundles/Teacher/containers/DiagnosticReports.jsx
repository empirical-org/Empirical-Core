import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import Index from '../components/progress_reports/diagnostic_reports/index.jsx'
import ActivityPacks from '../components/progress_reports/diagnostic_reports/activity_packs.jsx'
import DiagnosticActivityPacks from '../components/progress_reports/diagnostic_reports/diagnostic_activity_packs.jsx'
import NotCompleted from '../components/progress_reports/diagnostic_reports/not_completed.jsx'

export default class DiagnosticReports extends React.Component {
  render() {
      return (
        <HashRouter>
          <Route component={ActivityPacks} path='/activity_packs' />
          <Route component={DiagnosticActivityPacks} path='/diagnostics' />
          <Route component={NotCompleted} path='/not_completed' />
          <Route component={Index} path="/" />
        </HashRouter>
      );
  }
}
