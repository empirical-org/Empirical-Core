import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import StudentClassroomNavbar from '../components/student_profile/student_classroom_navbar.jsx';
import NextActivity from '../components/student_profile/next_activity.jsx';
import StudentProfileUnits from '../components/student_profile/student_profile_units.jsx';
import StudentProfileHeader from '../components/student_profile/student_profile_header';
import Setter from '../components/modules/setter.jsx';

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
    // this.modules.scrollify.scrollify('#page-content-wrapper', this)
    this.setState({ loading: true, });
    this.fetchData();
  },

  fetchData(currentClassroom) {
    this.setState({ currentClassroom, });
    this.setState({ loading: true, });
    $.ajax({ url: '/student_profile_data', data: { current_classroom_id: currentClassroom, }, format: 'json', success: this.loadProfile, });
  },

  loadProfile(data) {
    this.setState({ loading: false, scores: data.scores, student: data.student, });
  },

  render() {
    if (!this.state.loading) {
      return (
        <div id="student-profile">
          <StudentClassroomNavbar data={this.state.student} fetchData={this.fetchData} loading={this.state.loading} />
          <StudentProfileHeader studentName={this.state.student.name} classroomName={this.state.student.classroom.name} teacherName={this.state.student.classroom.teacher.name} />
          <NextActivity data={this.state.next_activity_session} loading={this.state.loading} hasActivities={!(_.isEmpty(this.state.grouped_scores))} />
          <StudentProfileUnits data={this.state.scores} loading={this.state.loading} />
        </div>
      );
    } return <span />;
  },
});
