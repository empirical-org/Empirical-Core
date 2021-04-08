import React from 'react';

import { requestGet } from '../../../modules/request';
import WelcomeModal from '../components/dashboard/welcome_modal'
import OnboardingChecklist from '../components/dashboard/onboarding_checklist'
import ActivityFeed from '../components/dashboard/activity_feed'
import HandyActions from '../components/dashboard/handy_actions'
import DailyTinyTip from '../components/dashboard/daily_tiny_tip'

const collegeBoardQuillLogoSrc = `${process.env.CDN_URL}/images/pages/dashboard/logo-quill-collegeboard.svg`

const Dashboard = ({ onboardingChecklist, firstName, mustSeeModal, linkedToClever, }) => {
  const [showWelcomeModal, setShowWelcomeModal] = React.useState(mustSeeModal)
  const [activityFeed, setActivityFeed] = React.useState(mustSeeModal)

  function closeWelcomeModal() { setShowWelcomeModal(false) }

  if (!onboardingChecklist.every(obj => obj.checked)) {
    return (<div className="dashboard">
      {showWelcomeModal && <WelcomeModal close={closeWelcomeModal} />}
      <OnboardingChecklist firstName={firstName} onboardingChecklist={onboardingChecklist} />
    </div>)
  }


  return (<div className="dashboard">
    <div className="post-checklist-container">
      <main>
        <ActivityFeed />
      </main>
      <aside>
        <HandyActions linkedToClever={linkedToClever} />
        <DailyTinyTip />
      </aside>
    </div>
  </div>)

}

export default Dashboard

// class Dashboard extends React.Component {
//   constructor(props) {
//     super(props)
//
//     this.state = {
//       showWelcomeModal: props.mustSeeModal,
//       classrooms: null,
//       hasPremium: null,
//       notifications: [],
//       performanceQuery: [
//         { header: 'Lowest Performing Students', results: null, },
//         { header: 'Difficult Concepts', results: null, }
//       ],
//     }
//
//     this.getNecessaryData()
//   }
//
//   componentWillUnmount() {
//     const ajaxCalls = this.ajax;
//     for (const key in ajaxCalls) {
//       if (ajaxCalls.hasOwnProperty(key)) {
//         ajaxCalls[key].abort();
//       }
//     }
//   }
//
//   everyObjectiveChecked = () => {
//     const { onboardingChecklist, } = this.props
//
//     return onboardingChecklist.every(obj => obj.checked)
//   }
//
//   getNecessaryData = () => {
//     if (!this.everyObjectiveChecked()) { return }
//
//     this.ajax = {};
//     this.ajax.classRoomRequest = requestGet('/teachers/classrooms/classroom_mini', (result) => {
//       this.setState({ classrooms: result.classes, });
//     });
//     this.ajax.premiumRequest = requestGet('/teachers/classrooms/premium', (result) => {
//       this.setState({ hasPremium: result.hasPremium, });
//     });
//     this.ajax.performanceQuery = requestGet('/teachers/classrooms/dashboard_query', (result) => {
//       this.setState({ performanceQuery: result.performanceQuery, });
//     });
//     this.ajax.notificationsQuery = requestGet('/teachers/classrooms/notifications', (results) => {
//       this.setState({ notifications: results })
//     })
//   }
//
//   onSuccess = (snackbarCopy) => {
//     this.getNecessaryData()
//     this.showSnackbar(snackbarCopy)
//   }
//
//   showSnackbar = snackbarCopy => {
//     this.setState({ showSnackbar: true, snackbarCopy }, () => {
//       setTimeout(() => this.setState({ showSnackbar: false, }), defaultSnackbarTimeout)
//     })
//   };
//
//   closeWelcomeModal = () => {
//     this.setState({ showWelcomeModal: false, })
//   }
//
//   hasClasses() {
//     if (this.state.classrooms) {
//       return (<MyClasses classList={this.state.classrooms} onSuccess={this.onSuccess} user={JSON.parse(this.props.user)} />);
//     }
//   }
//
//   renderWelcomeModal() {
//     if (this.state.showWelcomeModal) {
//       return (<WelcomeModal
//         close={this.closeWelcomeModal}
//       />)
//     }
//   }
//
//   render() {
//     const { snackbarCopy, showSnackbar, } = this.state
//     const { user, featuredBlogPosts, onboardingChecklist, firstName, } = this.props
//
//     if (!this.everyObjectiveChecked()) {
//       return (<div className="dashboard">
//         {this.renderWelcomeModal()}
//         <OnboardingChecklist firstName={firstName} onboardingChecklist={onboardingChecklist} />
//       </div>)
//     }
//
//     return (
//       <div id="dashboard">
//         <Snackbar text={snackbarCopy} visible={showSnackbar} />
//         {this.renderWelcomeModal()}
//         <ClassOverview
//           data={this.state.performanceQuery}
//           flag={JSON.parse(user).flag}
//           notifications={this.state.notifications}
//           premium={this.state.hasPremium}
//         />
//         {this.hasClasses()}
//         <TeacherCenter featuredBlogPosts={featuredBlogPosts} />
//         <DashboardFooter />
//       </div>
//     );
//   }
// }
