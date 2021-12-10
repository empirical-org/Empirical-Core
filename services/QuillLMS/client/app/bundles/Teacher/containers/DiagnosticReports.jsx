import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import Index from '../components/progress_reports/diagnostic_reports/index'
import ActivityPacks from '../components/progress_reports/diagnostic_reports/activity_packs'
import DiagnosticsIndex from '../components/progress_reports/diagnostic_reports/diagnostics/diagnostics_index'
import NotCompleted from '../components/progress_reports/diagnostic_reports/not_completed'

const DiagnosticReports = () => {
    return (
      <HashRouter>
        <Route component={ActivityPacks} path='/activity_packs' />
        <Route component={DiagnosticsIndex} path='/diagnostics' />
        <Route component={NotCompleted} path='/not_completed' />
        <Route component={Index} path="/" />
      </HashRouter>
    );
};

export default DiagnosticReports;
