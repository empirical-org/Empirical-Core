import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import AdminDashboard from './AdminDashboard';
import AdminDashboardContainer from './AdminDashboardContainer';
import DistrictActivityScoresProgressReport from './DistrictActivityScores';
import DistrictConceptReportsProgressReport from './DistrictConceptReports';
import DistrictStandardsReportsProgressReport from './DistrictStandardsReports';
import ActivityScoresStudentOverview from '../components/activity_scores_student_overview.tsx';

const AdminDashboardRouter = props => (
  <Router history={browserHistory} Router>
    <Route component={AdminDashboardContainer} path="teachers/admin_dashboard" >
      <IndexRoute adminId={props.id} component={AdminDashboard} />
      <Route component={DistrictActivityScoresProgressReport} path="district_activity_scores" />
      <Route component={ActivityScoresStudentOverview} path="district_activity_scores/student_overview" />
      <Route component={DistrictConceptReportsProgressReport} path="district_concept_reports" />
      <Route component={DistrictStandardsReportsProgressReport} path="district_standards_reports" />
    </Route>
  </Router>
  );

export default AdminDashboardRouter;
