import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import StudentClassroomNavbar from '../components/student_profile/student_classroom_navbar.jsx';
import NextActivity from '../components/student_profile/next_activity.jsx';
import StudentProfileUnits from '../components/student_profile/student_profile_units.jsx';
import StudentProfileHeader from '../components/student_profile/student_profile_header';
import Setter from '../components/modules/setter.jsx';
import Pusher from 'pusher-js';


export default React.createClass({
  getInitialState() {
    this.modules = {
      setter: new Setter(),
      // scrollify: new EC.modules.scrollify()
    };
    return {
      loading: true,
    };
  },

  componentDidMount() {
    this.fetchData();
  },

  fetchData(currentClassroom) {
    this.setState({ currentClassroom, loading: true, });
    $.ajax({ url: '/student_profile_data', data: { current_classroom_id: currentClassroom, }, format: 'json', success: this.loadProfile, });
  },

  loadProfile(data) {
    this.setState({ nextActivitySession: data.next_activity_session,
      loading: false,
      scores: data.scores,
      student: data.student, },
      () => this.initializePusher());
  },

  initializePusher() {
    const classroomId = this.state.student.classroom.id;
    if (process.env.NODE_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(classroomId.toString());
    const that = this;
    channel.bind('lesson-launched', () => {
      that.fetchData(classroomId);
    });
  },

  render() {
    if (!this.state.loading) {
      return (
        <div id="student-profile">
          <StudentClassroomNavbar data={this.state.student} fetchData={this.fetchData} loading={this.state.loading} />
          <StudentProfileHeader studentName={this.state.student.name} classroomName={this.state.student.classroom.name} teacherName={this.state.student.classroom.teacher.name} />
          <NextActivity data={this.state.nextActivitySession} loading={this.state.loading} hasActivities={this.state.scores.length > 0} />
          <StudentProfileUnits data={this.state.scores} loading={this.state.loading} />
        </div>
      );
    } return <span />;
  },
});
