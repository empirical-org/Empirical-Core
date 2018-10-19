import React from 'react';
import $ from 'jquery';
import ClassOverview from '../components/dashboard/class_overview';
import MyClasses from '../components/dashboard/my_classes';
import MyResources from '../components/dashboard/my_resources';
import DashboardFooter from '../components/dashboard/dashboard_footer';

export default React.createClass({
  getInitialState() {
    return ({
      classrooms: null,
      hasPremium: null,
      notifications: [],
      performanceQuery: [
        {header: 'Lowest Performing Students', results: null},
        { header: 'Difficult Concepts', results: null, }],
    });
  },

  componentWillMount() {
    this.ajax = {};
    this.ajax.classRoomRequest = $.get('classroom_mini', (result) => {
      this.setState({ classrooms: result.classes, });
    });
    this.ajax.premiumRequest = $.get('premium', (result) => {
      this.setState({ hasPremium: result.hasPremium, });
    });
    this.ajax.performanceQuery = $.get('dashboard_query', (result) => {
      this.setState({ performanceQuery: result.performanceQuery, });
    });
    this.ajax.notificationsQuery = $.get('/notifications', (results) => {
      this.setState({ notifications: results })
    })
  },

  componentWillUnmount() {
    const ajaxCalls = this.ajax;
    for (const key in ajaxCalls) {
      if (ajaxCalls.hasOwnProperty(key)) {
        ajaxCalls[key].abort();
      }
    }
  },

  hasClasses() {
    if (this.state.classrooms) {
      return (<MyClasses classList={this.state.classrooms} user={JSON.parse(this.props.user)} />);
    }
  },

  render() {
    return (
      <div id="dashboard">
        <ClassOverview
          data={this.state.performanceQuery}
          premium={this.state.hasPremium}
          flag={JSON.parse(this.props.user).flag}
          notifications={this.state.notifications}
        />
        {this.hasClasses()}
        <MyResources data={this.state} />
        <DashboardFooter />
      </div>
    );
  },
});
