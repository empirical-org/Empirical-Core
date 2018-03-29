import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import AdminDashboard from './AdminDashboard';
import AdminDashboardContainer from './AdminDashboardContainer';
import DistrictActivityScoresProgressReport from './DistrictActivityScores';
import DistrictConceptReportsProgressReport from './DistrictConceptReports';
import DistrictStandardsReportsProgressReport from './DistrictStandardsReports';
import ActivityScoresStudentOverview from '../components/activity_scores_student_overview.tsx';

const AdminDashboardRouter = props => (
  <Router Router history={browserHistory}>
      <Route path="teachers/admin_dashboard" component={AdminDashboardContainer} >
        <IndexRoute component={AdminDashboard} adminId={props.id} />
        <Route path="district_activity_scores" component={DistrictActivityScoresProgressReport} />
        <Route path="district_activity_scores/student_overview" component={ActivityScoresStudentOverview} />
        <Route path="district_concept_reports" component={DistrictConceptReportsProgressReport} />
        <Route path="district_standards_reports" component={DistrictStandardsReportsProgressReport} />
      </Route>
    </Router>
  );

export default AdminDashboardRouter;
