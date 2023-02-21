import React from 'react';
import { Switch, Route } from 'react-router-dom';

import AdminDashboard from './AdminDashboard';
import DistrictActivityScoresProgressReport from './DistrictActivityScores';
import DistrictConceptReportsProgressReport from './DistrictConceptReports';
import DistrictStandardsReportsProgressReport from './DistrictStandardsReports';
import SchoolSubscriptionsContainer from './SchoolSubscriptionsContainer';

import { RESTRICTED, LIMITED, FULL, } from '../shared'
import { requestGet, } from '../../../modules/request/index'
import SubnavTabs from '../components/subnav_tabs.tsx';
import ActivityScoresStudentOverview from '../components/activity_scores_student_overview.tsx';
import { Spinner, } from '../../Shared/index'

const APPROVED = 'Approved'

const AdminDashboardContainer = ({ id, location, children, }) => {
  const [adminInfo, setAdminInfo] = React.useState({})
  const [loading, setLoading] = React.useState(true)

  React.useEffect(getData, [])

  function getData() {
    requestGet(
      `${process.env.DEFAULT_URL}/admins/${id}/admin_info`,
      (body) => {
        setAdminInfo(body)
        setLoading(false)
      }
    );
  }

  function accessType() {
    const { admin_approval_status, administers_school_with_premium, } = adminInfo

    if (admin_approval_status && admin_approval_status !== APPROVED) { return RESTRICTED }

    if (administers_school_with_premium) { return FULL}

    return LIMITED
  }

  if (loading) {
    <Spinner />
  }

  const sharedProps = {
    adminInfo,
    accessType: accessType()
  }

  return (
    <div className="tab-content">
      <div className="tab-pane active" id="class-manager">
        <SubnavTabs path={location} />
        <div id="admin-dashboard">
          {children}
          <Switch>
            <Route component={routerProps => <ActivityScoresStudentOverview {...sharedProps} {...routerProps} />} path="/teachers/admin_dashboard/district_activity_scores/student_overview" />
            <Route component={routerProps => <DistrictActivityScoresProgressReport {...sharedProps} {...routerProps} />} path="/teachers/admin_dashboard/district_activity_scores" />
            <Route component={routerProps => <DistrictConceptReportsProgressReport {...sharedProps} {...routerProps} />} path="/teachers/admin_dashboard/district_concept_reports" />
            <Route component={routerProps => <DistrictStandardsReportsProgressReport {...sharedProps} {...routerProps} />} path="/teachers/admin_dashboard/district_standards_reports" />
            <Route component={routerProps => <SchoolSubscriptionsContainer {...sharedProps} {...routerProps} />} path="/teachers/admin_dashboard/school_subscriptions" />
            <Route component={routerProps => <AdminDashboard adminId={id} {...sharedProps} {...routerProps} />} exact path="/teachers/admin_dashboard/" />
          </Switch>
        </div>
      </div>
    </div>
  );


}

export default AdminDashboardContainer;
