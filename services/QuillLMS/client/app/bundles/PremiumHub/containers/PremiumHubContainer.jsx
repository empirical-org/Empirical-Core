import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PremiumHub from './PremiumHub';
import DistrictActivityScoresProgressReport from './DistrictActivityScores';
import DistrictConceptReportsProgressReport from './DistrictConceptReports';
import DistrictStandardsReportsProgressReport from './DistrictStandardsReports';
import SchoolSubscriptionsContainer from './SchoolSubscriptionsContainer';
import IntegrationsContainer from './IntegrationsContainer';
import PremiumFilterableReportsContainer from './PremiumFilterableReportsContainer';

import { requestGet, } from '../../../modules/request/index';
import { NOT_LISTED, NO_SCHOOL_SELECTED, Spinner } from '../../Shared/index';
import ActivityScoresStudentOverview from '../components/activity_scores_student_overview.tsx';
import SubnavTabs from '../components/subnav_tabs.tsx';
import { APPROVED, DENIED, FULL, LIMITED, LOADING, PENDING, RESTRICTED, SKIPPED } from '../shared';

const BANNER_BUTTON_CLASS_NAME = "quill-button small secondary outlined focus-on-light"

const Banner = ({ bodyText, headerText, buttons, }) => (
  <section className="admin-banner">
    <div className="banner-content">
      <div>
        <h3>{headerText}</h3>
        <p>{bodyText}</p>
      </div>
      {buttons}
    </div>
  </section>
)

const PremiumHubContainer = ({ id, location, children, user, }) => {
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
    if (Object.keys(adminInfo).length === 0) { return LOADING } // prevents incorrect banner flashing and reports rendering during loading

    const { admin_approval_status, administers_school_with_premium, } = adminInfo

    if (admin_approval_status && admin_approval_status !== APPROVED) { return RESTRICTED }

    if (administers_school_with_premium) { return FULL}

    return LIMITED
  }

  function renderBanner() {
    const { admin_approval_status, associated_school, } = adminInfo

    if (accessType() === FULL || accessType() === LOADING) { return <span /> }

    if (accessType() === LIMITED) {
      return (
        <Banner
          bodyText="Subscribe to School or District Premium to unlock all Premium Hub features. Manage teacher accounts, access teacher reports, and view school-wide student data."
          buttons={(
            <div className="banner-buttons">
              <a className={BANNER_BUTTON_CLASS_NAME} href="https://calendly.com/alex-quill" rel="noopener noreferrer" target="_blank">Talk to sales</a>
              <a className={BANNER_BUTTON_CLASS_NAME} href="/premium" target="_blank">Explore premium</a>
            </div>
          )}
          headerText="Unlock with Quill Premium"
        />
      )
    }

    if (!associated_school || [NOT_LISTED, NO_SCHOOL_SELECTED].includes(associated_school.name)) {
      return (
        <Banner
          bodyText="Please select a school to use the Premium Hub."
          buttons={<a className={BANNER_BUTTON_CLASS_NAME} href="/teachers/my_account">Select school</a>}
          headerText="Action required"
        />
      )
    }

    if (admin_approval_status === DENIED) {
      return (
        <Banner
          bodyText={`Sorry, we couldn’t verify you as an admin of ${associated_school?.name}. If you need help, contact support.`}
          buttons={<a className={BANNER_BUTTON_CLASS_NAME} href="mailto:hello@quill.org">Contact us</a>}
          headerText="We couldn't verify you"
        />
      )
    }

    if (admin_approval_status === PENDING) {
      return (
        <Banner
          bodyText="Your verification request is pending approval. Once approved, you will be able to use the Premium Hub. If you need help in the meantime, contact us."
          buttons={<a className={BANNER_BUTTON_CLASS_NAME} href="mailto:hello@quill.org">Contact us</a>}
          headerText="We’re reviewing your request"
        />
      )
    }

    if (admin_approval_status === SKIPPED) {
      return (
        <Banner
          bodyText={`Please verify your connection to ${associated_school?.name} to use the Premium Hub.`}
          buttons={<a className={BANNER_BUTTON_CLASS_NAME} href="/sign-up/verify-school">Begin verification</a>}
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
    accessType: accessType(),
    user
  }

  return (
    <div className="tab-content">
      <div className="tab-pane active" id="class-manager">
        <SubnavTabs path={location} />
        <div id="premium-hub">
          {children}
          {renderBanner()}
          <Switch>
            <Route component={routerProps => <ActivityScoresStudentOverview {...sharedProps} {...routerProps} />} path="/teachers/premium_hub/district_activity_scores/student_overview" />
            <Route component={routerProps => <DistrictActivityScoresProgressReport {...sharedProps} {...routerProps} />} path="/teachers/premium_hub/district_activity_scores" />
            <Route component={routerProps => <DistrictConceptReportsProgressReport {...sharedProps} {...routerProps} />} path="/teachers/premium_hub/district_concept_reports" />
            <Route component={routerProps => <DistrictStandardsReportsProgressReport {...sharedProps} {...routerProps} />} path="/teachers/premium_hub/district_standards_reports" />
            <Route component={routerProps => <SchoolSubscriptionsContainer {...sharedProps} {...routerProps} />} path="/teachers/premium_hub/school_subscriptions" />
            <Route component={routerProps => <IntegrationsContainer {...sharedProps} {...routerProps} />} path="/teachers/premium_hub/integrations" />
            <Route component={routerProps => <PremiumFilterableReportsContainer adminId={id} {...sharedProps} {...routerProps} />} path="/teachers/premium_hub/diagnostic_growth_report" />
            <Route component={routerProps => <PremiumFilterableReportsContainer adminId={id} {...sharedProps} {...routerProps} />} path="/teachers/premium_hub/usage_snapshot_report" />
            <Route component={routerProps => <PremiumFilterableReportsContainer adminId={id} {...sharedProps} {...routerProps} />} path="/teachers/premium_hub/data_export" />
            <Route component={routerProps => <PremiumHub adminId={id} {...sharedProps} {...routerProps} />} exact path="/teachers/premium_hub/" />
          </Switch>
        </div>
      </div>
    </div>
  );


}

export default PremiumHubContainer;
