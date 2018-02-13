import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import StudentsClassroomsHeader from '../components/student_profile/students_classrooms/students_classrooms_header.jsx'
import NextActivity from '../components/student_profile/next_activity.jsx';
import StudentProfileUnits from '../components/student_profile/student_profile_units.jsx';
import StudentProfileHeader from '../components/student_profile/student_profile_header';
import Pusher from 'pusher-js';
import { connect } from 'react-redux'
import { fetchStudentProfile } from '../../../actions/student_profile'

const StudentProfile = React.createClass({
  componentDidMount() {
    this.props.fetchStudentProfile();
  },

  componentDidUpdate() {
    this.initializePusher();
  },

  initializePusher() {
    let classroomId = this.props.studentProfile.student.classroom.id;

    if (process.env.NODE_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(classroomId.toString());
    const that = this;
    channel.bind('lesson-launched', () => {
      that.props.fetchStudentProfile(classroomId);
    });
  },

  render() {
    if (!this.props.studentProfile.loading) {
      return (
        <div id="student-profile">
          <StudentsClassroomsHeader currentClassroomId={this.props.studentProfile.student.classroom.id} fetchData={this.props.fetchStudentProfile} loading={this.props.studentProfile.loading}/>
          <StudentProfileHeader studentName={this.props.studentProfile.student.name} classroomName={this.props.studentProfile.student.classroom.name} teacherName={this.props.studentProfile.student.classroom.teacher.name} />
          <NextActivity data={this.props.studentProfile.nextActivitySession} loading={this.props.studentProfile.loading} hasActivities={this.props.studentProfile.scores.length > 0} />
          <StudentProfileUnits data={this.props.studentProfile.scores} loading={this.props.studentProfile.loading} />
        </div>
      );
    } return <span />;
  },
});

const mapStateToProps = (state) => { return state };
const mapDispatchToProps = (dispatch) => {
  return {
    fetchStudentProfile: (classroomId) => dispatch(fetchStudentProfile(classroomId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile);
