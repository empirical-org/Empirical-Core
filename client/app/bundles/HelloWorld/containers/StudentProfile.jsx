import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import StudentClassroomNavbar from '../components/student_profile/student_classroom_navbar.jsx';
import NextActivity from '../components/student_profile/next_activity.jsx';
import StudentProfileUnits from '../components/student_profile/student_profile_units.jsx';
import StudentProfileHeader from '../components/student_profile/student_profile_header';
import Pusher from 'pusher-js';
import { connect } from 'react-redux'
import { fetchStudentProfile } from '../../../actions/student_profile'

const StudentProfile = React.createClass({
  componentDidMount() {
    this.fetchData();
  },

  componentDidUpdate() {
    this.initializePusher();
  },

  initializePusher() {
    let classroomId = this.props.student.classroom.id;

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

  fetchData(classroomId) {
    fetchStudentProfile(this.props.dispatch, classroomId);
  },

  render() {
    if (!this.props.loading) {
      return (
        <div id="student-profile">
          <StudentClassroomNavbar data={this.props.student} fetchData={this.fetchData} loading={this.props.loading} />
          <StudentProfileHeader studentName={this.props.student.name} classroomName={this.props.student.classroom.name} teacherName={this.props.student.classroom.teacher.name} />
          <NextActivity data={this.props.nextActivitySession} loading={this.props.loading} hasActivities={this.props.scores.length > 0} />
          <StudentProfileUnits data={this.props.scores} loading={this.props.loading} />
        </div>
      );
    } return <span />;
  },
});

const mapStateToProps = (state) => { return state };


export default connect(mapStateToProps)(StudentProfile);
