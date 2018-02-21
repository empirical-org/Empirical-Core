import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import AdminDashboard from './AdminDashboard';
import AdminDashboardContainer from './AdminDashboardContainer'
import DistrictActivityScoresProgressReport from '../components/progress_reports/district_activity_scores_progress_report'

const AdminDashboardRouter = (props) => {
  return (
    <Router Router history={browserHistory}>
      <Route path="teachers/admin_dashboard" component={AdminDashboardContainer} >
        <IndexRoute component={AdminDashboard} />
        <Route path="district_activity_scores" component={DistrictActivityScoresProgressReport} />
      </Route>
    </Router>
  );
};

export default AdminDashboardRouter;
