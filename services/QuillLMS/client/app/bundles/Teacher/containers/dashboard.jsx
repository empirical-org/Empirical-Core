import React from 'react';
import { requestGet } from '../../../modules/request';
import ClassOverview from '../components/dashboard/class_overview';
import MyClasses from '../components/dashboard/my_classes';
import TeacherCenter from '../components/dashboard/teacher_center.tsx';
import DashboardFooter from '../components/dashboard/dashboard_footer';
import ExploreActivitiesModal from '../components/dashboard/explore_activities_modal'

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showExploreActivitiesModal: props.mustSeeModal,
      classrooms: null,
      hasPremium: null,
      notifications: [],
      performanceQuery: [
        { header: 'Lowest Performing Students', results: null, },
        { header: 'Difficult Concepts', results: null, }
      ],
    }

    this.ajax = {};
    this.ajax.classRoomRequest = requestGet('/teachers/classrooms/classroom_mini', (result) => {
      this.setState({ classrooms: result.classes, });
    });
    this.ajax.premiumRequest = requestGet('/teachers/classrooms/premium', (result) => {
      this.setState({ hasPremium: result.hasPremium, });
    });
    this.ajax.performanceQuery = requestGet('/teachers/classrooms/dashboard_query', (result) => {
      this.setState({ performanceQuery: result.performanceQuery, });
    });
    this.ajax.notificationsQuery = requestGet('/teachers/classrooms/notifications', (results) => {
      this.setState({ notifications: results })
    })
  }

  componentWillUnmount() {
    const ajaxCalls = this.ajax;
    for (const key in ajaxCalls) {
      if (ajaxCalls.hasOwnProperty(key)) {
        ajaxCalls[key].abort();
      }
    }
  }

  closeExploreActivitiesModal = () => {
    this.setState({ showExploreActivitiesModal: false, })
  }

  hasClasses() {
    if (this.state.classrooms) {
      return (<MyClasses classList={this.state.classrooms} user={JSON.parse(this.props.user)} />);
    }
  }

  renderExploreActivitiesModal() {
    if (this.state.showExploreActivitiesModal) {
      return (<ExploreActivitiesModal
        cancel={this.closeExploreActivitiesModal}
      />)
    }
  }

  render() {
    const { user, featuredBlogPosts, } = this.props
    return (
      <div id="dashboard">
        {this.renderExploreActivitiesModal()}
        <ClassOverview
          data={this.state.performanceQuery}
          flag={JSON.parse(user).flag}
          notifications={this.state.notifications}
          premium={this.state.hasPremium}
        />
        {this.hasClasses()}
        <TeacherCenter featuredBlogPosts={featuredBlogPosts} />
        <DashboardFooter />
      </div>
    );
  }
}
