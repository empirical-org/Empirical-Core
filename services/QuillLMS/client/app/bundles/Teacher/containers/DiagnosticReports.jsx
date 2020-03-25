import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import Index from '../components/progress_reports/diagnostic_reports/index.jsx'

export default class DiagnosticReports extends React.Component {
  render() {
      return (
        <HashRouter>
          <Route component={Index} path="/" />
        </HashRouter>
      );
  }
}
