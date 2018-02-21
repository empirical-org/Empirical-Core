import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import AdminDashboard from './AdminDashboard';
import AdminDashboardContainer from './AdminDashboardContainer'
import DistrictActivityScoresProgressReport from '../components/district_activity_scores'

const AdminDashboardRouter = (props) => {
  return (
    <Router Router history={browserHistory}>
      <Route path="teachers/admin_dashboard" component={AdminDashboardContainer} >
        <IndexRoute component={AdminDashboard} adminId={props.id} />
        <Route path="district_activity_scores" component={DistrictActivityScoresProgressReport} />
      </Route>
    </Router>
  );
};

export default AdminDashboardRouter;
