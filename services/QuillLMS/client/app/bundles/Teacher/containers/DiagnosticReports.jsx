import React from 'react'
import { HashRouter, Route } from 'react-router-dom'
import { CompatRouter } from "react-router-dom-v5-compat";

import ActivityPacks from '../components/progress_reports/diagnostic_reports/activity_packs'
import DiagnosticsIndex from '../components/progress_reports/diagnostic_reports/diagnostics/diagnostics_index'
import Index from '../components/progress_reports/diagnostic_reports/index'
import NotCompleted from '../components/progress_reports/diagnostic_reports/not_completed'

const DiagnosticReports = ({ show_lessons_banner, }) => {
  return (
    <HashRouter>
      <CompatRouter>
        <Route component={ActivityPacks} path='/activity_packs' />
        <Route path='/diagnostics' render={() => <DiagnosticsIndex lessonsBannerIsShowable={show_lessons_banner} />} />
        <Route component={NotCompleted} path='/not_completed' />
        <Route component={Index} path="/" />
      </CompatRouter>
    </HashRouter>
  );
};

export default DiagnosticReports;
