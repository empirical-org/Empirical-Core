import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Overview from './Overview'
import DistrictActivityScoresProgressReport from './DistrictActivityScores';
import DistrictConceptReportsProgressReport from './DistrictConceptReports';
import DistrictStandardsReportsProgressReport from './DistrictStandardsReports';
import IntegrationsContainer from './IntegrationsContainer';
import PremiumFilterableReportsContainer from './PremiumFilterableReportsContainer';
import AccountManagement from './AccountManagement';
import SchoolSubscriptionsContainer from './SchoolSubscriptionsContainer'

import { requestGet, } from '../../../modules/request/index';
import { NOT_LISTED, NO_SCHOOL_SELECTED, PostNavigationBanner, Spinner } from '../../Shared/index';
import ActivityScoresStudentOverview from '../components/activity_scores_student_overview.tsx';
import SubnavTabs from '../components/subnav_tabs.tsx';
import { APPROVED, DENIED, FULL, LIMITED, LOADING, PENDING, RESTRICTED, SKIPPED } from '../shared';


const ScrollToTop = ({ history, children, }) => {
  React.useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    }
  }, []);

  return children
}

const PremiumHubContainer = ({ id, history, location, children, user, }) => {
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

    if (administers_school_with_premium) { return FULL }

    return LIMITED
  }

  function renderBanner() {
    const { admin_approval_status, associated_school, administers_school_with_current_or_expired_premium, } = adminInfo

    if (accessType() === FULL || accessType() === LOADING) { return <span /> }

    const onPageThatShouldShowBanner = ['subscriptions', 'account_management'].some((path) => location.pathname.includes(path))
    const onSubscriptionPageWithExpiredPremium = location.pathname.includes('subscriptions') && administers_school_with_current_or_expired_premium

    if (accessType() === LIMITED && onPageThatShouldShowBanner && !onSubscriptionPageWithExpiredPremium) {
      return (
        <PostNavigationBanner
          bannerStyle="gold"
          bodyText="Subscribe to School or District Premium to unlock all Premium Hub features. Manage teacher accounts, access teacher reports, and view school-wide student data."
          buttons={[
            {
              href: "https://calendly.com/alex-quill",
              standardButtonStyle: true,
              text: "Contact sales",
              target: "_blank"
            },
            {
              href: "/premium",
              standardButtonStyle: true,
              text: "Explore Premium",
              target: "_blank"
            }
          ]}
          icon={{ alt: "Image of a school building", src: "https://assets.quill.org/images/banners/large-school-campus-gold.svg" }}
          primaryHeaderText="Unlock with Quill Premium"
          tagText=""
        />
      )
    }

    if (!associated_school || [NOT_LISTED, NO_SCHOOL_SELECTED].includes(associated_school.name)) {
      return (
        <PostNavigationBanner
          bannerStyle="gold"
          bodyText="Please select a school to use the Premium Hub."
          buttons={[
            {
              href: "/teachers/my_account",
              standardButtonStyle: true,
              text: "Select school",
              target: ""
            }
          ]}
          icon={{ alt: "Image of a school building", src: "https://assets.quill.org/images/banners/large-school-campus-gold.svg" }}
          primaryHeaderText="Action required"
          tagText=""
        />
      )
    }

    if (admin_approval_status === DENIED) {
      return (
        <PostNavigationBanner
          bannerStyle="gold"
          bodyText={`Sorry, we couldn’t verify you as an admin of ${associated_school?.name}. If you need help, contact support.`}
          buttons={[
            {
              href: "mailto:hello@quill.org",
              standardButtonStyle: true,
              text: "Contact us",
              target: "_blank"
            }
          ]}
          icon={{ alt: "Image of a school building", src: "https://assets.quill.org/images/banners/large-school-campus-gold.svg" }}
          primaryHeaderText="We couldn't verify you"
          tagText=""
        />
      )
    }

    if (admin_approval_status === PENDING) {
      return (
        <PostNavigationBanner
          bannerStyle="gold"
          bodyText="Your verification request is pending approval. Once approved, you will be able to use the Premium Hub. If you need help in the meantime, contact us."
          buttons={[
            {
              href: "mailto:hello@quill.org",
              standardButtonStyle: true,
              text: "Contact us",
              target: ""
            }
          ]}
          icon={{ alt: "Image of a school building", src: "https://assets.quill.org/images/banners/large-school-campus-gold.svg" }}
          primaryHeaderText="We're reviewing your request"
          tagText=""
        />
      )
    }

    if (admin_approval_status === SKIPPED) {
      return (
        <PostNavigationBanner
          bannerStyle="gold"
          bodyText={`Please verify your connection to ${associated_school?.name} to use the Premium Hub.`}
          buttons={[
            {
              href: "/sign-up/verify-school",
              standardButtonStyle: true,
              text: "Begin verification",
              target: ""
            }
          ]}
          icon={{ alt: "Image of a school building", src: "https://assets.quill.org/images/banners/large-school-campus-gold.svg" }}
          primaryHeaderText="Action required"
          tagText=""
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
      <ScrollToTop history={history}>
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
              <Route component={routerProps => <AccountManagement adminId={id} {...sharedProps} {...routerProps} />} exact path="/teachers/premium_hub/account_management" />
              <Route component={routerProps => <Overview adminId={id} {...sharedProps} {...routerProps} />} exact path="/teachers/premium_hub" />
            </Switch>
          </div>
        </div>
      </ScrollToTop>
    </div>
  );


}

export default PremiumHubContainer;
