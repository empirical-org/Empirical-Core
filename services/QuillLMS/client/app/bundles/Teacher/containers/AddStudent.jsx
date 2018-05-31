import React from 'react';
import _ from 'lodash';
import ItemDropdown from '../components/general_components/dropdown_selectors/item_dropdown.jsx';
import $ from 'jquery';
import ClassroomsStudentsTable from '../components/general_components/classrooms_students_table.jsx';
import LoadingSpinner from '../components/shared/loading_indicator.jsx';
import StudentCreatesAccountSection from '../components/invite_users/add_students/StudentCreatesAccountSection.jsx';
import TeacherCreatesAccountSection from '../components/invite_users/add_students/TeacherCreatesAccountSection.jsx';
import GoogleClassroomCreatesAccountSection from '../components/invite_users/add_students/GoogleClassroomCreatesAccountSection.jsx';
import EmptyProgressReport from '../components/shared/EmptyProgressReport.jsx';
require('../../../../../app/assets/stylesheets/pages/invite-students.scss');

export default React.createClass({

  propTypes: {
    classrooms: React.PropTypes.array.isRequired,
  },

  getInitialState() {
    return ({
      selectedClassroom: this.props.classrooms[0] || [
        {
          name: 'No Classrooms',
          id: 0,
        }
      ],
      firstName: '',
      lastName: '',
      loading: true,
      errors: null,
      disabled: false,
      showModal: false
    });
  },

  componentDidMount() {
    if (this.props.classrooms && this.props.classrooms.length) {
      this.retrieveStudents(this.state.selectedClassroom.id);
    }
  },

  retrieveStudents(classroomId) {
    const that = this;
    $.ajax({ url: `/teachers/classrooms/${classroomId}/students_list`, }).success((data) => {
      that.setState({ students: data.students, loading: false, });
    });
  },

  updateClassroom(classroom) {
    this.setState({ selectedClassroom: classroom, loading: true, });
    this.retrieveStudents(classroom.id);
  },

  stateSpecificComponent() {
    if (this.state.loading) {
      return <LoadingSpinner />;
    } else if (this.state.students.length > 0) {
      return <ClassroomsStudentsTable key={'students-table'} students={this.state.students} />;
    }
  },

  nameChange(e, key) {
    const newNameState = {};
    newNameState[key] = e.target.value;
    this.setState(newNameState);
  },

  submitStudent(e) {
    const firstName = this.state.firstName;
    const lastName = this.state.lastName;
    this.setState({
      disabled: true,
      loading: true,
    });

    const that = this;
    $.post(`/teachers/classrooms/${this.state.selectedClassroom.id}/students`, {
      user: {
        first_name: firstName,
        last_name: lastName,
      },
    })

			.success((data) => {
  const student = data.user;
  const students = this.state.students.slice(0);
  students.unshift(student);
  that.setState({
    firstName: '',
    lastName: '',
    disabled: false,
    students,
    loading: false,
    errors: null,
  });
})

			.fail((jqXHR) => {
  that.setState({
    disabled: false,
    loading: false,
    errors: jQuery.parseJSON(jqXHR.responseText).error,
  });
});
  },

  syncOrModal() {
    if (this.props.user.signed_up_with_google) {
				// they are already a google user, so we just need to use the callback
      this.syncClassrooms();
    } else {
				// they are not a google user, so we will show them the modal where they
				// can become one
      this.setState({ showModal: true, });
    }
  },

  syncClassrooms() {
    window.location = '/teachers/classrooms/google_sync';
  },

  hideModal() {
    this.setState({ showModal: false, });
  },

  render() {
    if (this.props.classrooms && this.props.classrooms.length === 0) {
      return <EmptyProgressReport />;
    }
    return (
      <div className="invite-students">
        <div className="container">
          <div className="classroom-dropdown-row">Select Classroom: <ItemDropdown items={this.props.classrooms} callback={this.updateClassroom} /></div>
          <div className="option-boxes">
            <div className="box-section"><StudentCreatesAccountSection key="student-section" classCode={this.state.selectedClassroom.code} /></div>
            <div className="box-section"><GoogleClassroomCreatesAccountSection
              key="google-classroom-section"
              user={this.props.user}
              syncClassrooms={this.syncClassrooms}
              showModal={this.state.showModal}
              hideModal={this.hideModal}
              syncOrModal={this.syncOrModal}
            />
            </div>
          </div>
          <TeacherCreatesAccountSection key="teacher-create-account" classID={this.state.selectedClassroom.id} firstName={this.state.firstName} lastName={this.state.lastName} nameChange={this.nameChange} disabled={this.state.disabled} submitStudent={this.submitStudent} errors={this.state.errors} loading={this.state.loading}/> {this.stateSpecificComponent()}
        </div>
      </div>
    );
  },
});
