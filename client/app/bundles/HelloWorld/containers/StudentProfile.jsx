import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import StudentProfileHeader from '../components/student_profile/student_profile_header.jsx'
import NextActivity from '../components/student_profile/next_activity.jsx'
import StudentProfileUnits from '../components/student_profile/student_profile_units.jsx'
import Setter from '../components/modules/setter.jsx'

export default React.createClass({
  getInitialState: function () {
    this.modules = {
      setter: new Setter(),
      // scrollify: new EC.modules.scrollify()
    };
    return {
      next_activity_session: {activity: {}},
      student: {classroom: {teacher: {}}},
      grouped_scores: {},
      is_last_page: false,
      currentPage: 0,
      firstBatchLoaded: false,
      loading: false
    };
  },

  componentDidMount: function () {
    // this.modules.scrollify.scrollify('#page-content-wrapper', this)
    this.setState({loading: true})
    this.fetchData();
  },

  fetchData: function (currentClassroom) {
    // var newCurrentPage = this.state.currentPage + 1;
    this.setState({currentClassroom: currentClassroom});
    this.setState({loading: true})
    // this.setState({loading: true, currentPage: newCurrentPage})
    $.ajax({url: '/profile.json', data: {current_page: this.state.currentPage, current_classroom_id: currentClassroom}, format: 'json', success: this.loadProfile})
  },

  loadProfile: function (data) {
    // commented out lines are no longer necessary as we don't do infinite scroll any longer
    // they will need to be refactored if we turn it back on, as they are not compatible with multiple classrooms
    // //  need to deep merge the grouped_scores
    // var mergeArrays, merged;
    // mergeArrays = true;
    // merged = this.modules.setter.setOrExtend(this.state, null, data, mergeArrays)
    this.setState(_.extend(data, {ajaxReturned: true, loading: false, firstBatchLoaded: true}))
  },

  render: function () {
    if (this.state.firstBatchLoaded) {
      return (
        <div id="student-profile">
          <StudentProfileHeader data={this.state.student} fetchData={this.fetchData} />
          <NextActivity data={this.state.next_activity_session} />
          <StudentProfileUnits data={this.state.grouped_scores} />
        </div>
      )
    } else return <span></span>
  }
});
