import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SubnavTabs from '../components/subnav_tabs.tsx';
import AdminDashboard from './AdminDashboard';
import DistrictActivityScoresProgressReport from './DistrictActivityScores';
import DistrictConceptReportsProgressReport from './DistrictConceptReports';
import DistrictStandardsReportsProgressReport from './DistrictStandardsReports';
import SchoolSubscriptionsContainer from './SchoolSubscriptionsContainer';
import ActivityScoresStudentOverview from '../components/activity_scores_student_overview.tsx';

const AdminDashboardContainer = (props) => (
  <div className="tab-content">
    <div className="tab-pane active" id="class-manager">
      <SubnavTabs path={props.location} />
      <div id="admin-dashboard">
        {props.children}
        <Switch>
          <Route component={ActivityScoresStudentOverview} path="/teachers/admin_dashboard/district_activity_scores/student_overview" />
          <Route component={DistrictActivityScoresProgressReport} path="/teachers/admin_dashboard/district_activity_scores" />
          <Route component={DistrictConceptReportsProgressReport} path="/teachers/admin_dashboard/district_concept_reports" />
          <Route component={DistrictStandardsReportsProgressReport} path="/teachers/admin_dashboard/district_standards_reports" />
          <Route component={SchoolSubscriptionsContainer} path="/teachers/admin_dashboard/school_subscriptions" />
          <Route component={routerProps => <AdminDashboard adminId={props.id} {...routerProps} />} exact path="/teachers/admin_dashboard/" />
        </Switch>
      </div>
    </div>
  </div>
);

export default AdminDashboardContainer;
