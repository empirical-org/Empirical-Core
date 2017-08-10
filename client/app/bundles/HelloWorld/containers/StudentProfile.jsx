import React from 'react'
import $ from 'jquery'
import _ from 'underscore'
import StudentClassroomNavbar from '../components/student_profile/student_classroom_navbar.jsx'
import NextActivity from '../components/student_profile/next_activity.jsx'
import StudentProfileUnits from '../components/student_profile/student_profile_units.jsx'
import StudentProfileHeader from '../components/student_profile/student_profile_header'
import Setter from '../components/modules/setter.jsx'
import Pusher from 'pusher-js'

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
    this.setState({currentClassroom: currentClassroom});
    this.setState({loading: true})
    $.ajax({url: '/student_profile_data', data: {current_classroom_id: currentClassroom}, format: 'json', success: this.loadProfile})
  },

  loadProfile: function (data) {
    // commented out lines are no longer necessary as we don't do infinite scroll any longer
    // they will need to be refactored if we turn it back on, as they are not compatible with multiple classrooms
    // //  need to deep merge the grouped_scores
    // var mergeArrays, merged;
    // mergeArrays = true;
    // merged = this.modules.setter.setOrExtend(this.state, null, data, mergeArrays)
    this.setState(_.extend(data, {ajaxReturned: true, loading: false, firstBatchLoaded: true}), () => this.initializePusher())
  },

  initializePusher: function(){
    const classroomId = this.state.student.classroom.id
    if (process.env.NODE_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, {encrypted: true});
    const channel = pusher.subscribe(classroomId.toString());
    const that = this;
    channel.bind('lesson-launched', function(data) {
      that.fetchData(classroomId)
    });
  },


  render: function () {
    if (this.state.firstBatchLoaded) {
      return (
          <div id="student-profile">
            <StudentClassroomNavbar data={this.state.student} fetchData={this.fetchData} loading={this.state.loading} />
            <StudentProfileHeader studentName={this.state.student.name} classroomName={this.state.student.classroom.name} teacherName={this.state.student.classroom.teacher.name}/>
            <NextActivity data={this.state.next_activity_session} loading={this.state.loading} hasActivities={!(_.isEmpty(this.state.grouped_scores))}/>
            <StudentProfileUnits data={this.state.grouped_scores} loading={this.state.loading}/>
          </div>
      )
    } else return <span></span>
  }
});
