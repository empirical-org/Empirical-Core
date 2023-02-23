import React from 'react';
import { Switch, Route } from 'react-router-dom';

import AdminDashboard from './AdminDashboard';
import DistrictActivityScoresProgressReport from './DistrictActivityScores';
import DistrictConceptReportsProgressReport from './DistrictConceptReports';
import DistrictStandardsReportsProgressReport from './DistrictStandardsReports';
import SchoolSubscriptionsContainer from './SchoolSubscriptionsContainer';

import { RESTRICTED, LIMITED, FULL, APPROVED, PENDING, DENIED, SKIPPED, } from '../shared'
import { requestGet, } from '../../../modules/request/index'
import SubnavTabs from '../components/subnav_tabs.tsx';
import ActivityScoresStudentOverview from '../components/activity_scores_student_overview.tsx';
import { Spinner, NOT_LISTED, NO_SCHOOL_SELECTED } from '../../Shared/index'

const BANNER_BUTTON_CLASS_NAME = "quill-button small secondary outlined focus-on-light"

const Banner = ({ bodyText, headerText, button, }) => (
  <section className="admin-banner">
    <div className="banner-content">
      <div>
        <h3>{headerText}</h3>
        <p>{bodyText}</p>
      </div>
      {button}
    </div>
  </section>
)

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

  function renderBanner() {
    const { admin_approval_status, associated_school, } = adminInfo

    if (accessType() === FULL) { return <span /> }

    if (accessType() === LIMITED) {
      return (
        <Banner
          bodyText="Subscribe to School or District Premium to unlock all admin dashboard features. Manage teacher accounts, access teacher reports, and view school-wide student data."
          button={<a className={BANNER_BUTTON_CLASS_NAME} href="/premium" target="_blank">Explore premium</a>}
          headerText="Unlock with Quill Premium"
        />
      )
    }

    if (!associated_school || [NOT_LISTED, NO_SCHOOL_SELECTED].includes(associated_school.name)) {
      return (
        <Banner
          bodyText="Please select a school to use the admin dashboard."
          button={<a className={BANNER_BUTTON_CLASS_NAME} href="/teachers/my_account">Select school</a>}
          headerText="Action required"
        />
      )
    }

    if (admin_approval_status === DENIED) {
      return (
        <Banner
          bodyText={`Sorry, we couldn’t verify you as an admin of ${associated_school?.name}. If you need help, contact support.`}
          button={<a className={BANNER_BUTTON_CLASS_NAME} href="mailto:hello@quill.org">Contact us</a>}
          headerText="We couldn't verify you"
        />
      )
    }

    if (admin_approval_status === PENDING) {
      return (
        <Banner
          bodyText="Your verification request is pending approval. Once approved, you will be able to use the admin dashboard. If you need help in the meantime, contact us."
          button={<a className={BANNER_BUTTON_CLASS_NAME} href="mailto:hello@quill.org">Contact us</a>}
          headerText="We’re reviewing your request"
        />
      )
    }

    if (admin_approval_status === SKIPPED) {
      return (
        <Banner
          bodyText={`Please verify your connection to ${associated_school?.name} to use the admin dashboard.`}
          button={<a className={BANNER_BUTTON_CLASS_NAME} href="/sign-up/verify-school">Begin verification</a>}
          headerText="Action required"
        />
      )
    }
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
          {renderBanner()}
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
