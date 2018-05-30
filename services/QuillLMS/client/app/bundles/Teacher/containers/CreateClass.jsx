import React from 'react';
import $ from 'jquery';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NumberSuffix from '../components/modules/numberSuffixBuilder.js';
import ButtonLoadingIndicator from '../components/shared/button_loading_indicator.jsx';
import GoogleClassroomModal from '../components/dashboard/google_classroom_modal';

export default React.createClass({

  propTypes: {
    hasClassroomActivities: React.PropTypes.bool,
  },

  componentDidMount() {
    this.getClassCode();
  },

  getInitialState() {
    return {
      classroom: {
        name: '',
        grade: null,
        code: null,
      },
      loading: false,
      errors: '',
      showModal: false,
    };
  },

  getClassCode() {
    $.ajax({ url: '/teachers/classrooms/regenerate_code', success: this.setClassCode, });
  },

  setClassCode(data) {
    const newClass = Object.assign({}, this.state.classroom);
    newClass.code = data.code;
    this.setState({ classroom: newClass, loading: false, });
  },

  grades() {
    // Note to maintainers: if you update the grade options here, please also
    // ensure to do so in the following locations:
    //   - /app/views/teachers/students/index.html.erb
    //   - /client/app/bundles/Teacher/components/google_classroom/google_classroom_sync/GoogleClassroomsList.jsx
    const grades = [];
    for (let grade = 1; grade <= 12; grade++) {
      grades.push(
        <MenuItem key={grade} eventKey={grade}>{NumberSuffix(grade)}</MenuItem>
            );
    }
    grades.push(<MenuItem key={'University'} eventKey={'University'}>University</MenuItem>);
    grades.push(<MenuItem key={'Other'} eventKey={'Other'}>Other</MenuItem>);
    return grades;
  },

  handleChange(e) {
    const newClass = Object.assign({}, this.state.classroom);
    newClass.name = e.currentTarget.value;
    this.setState({ classroom: newClass, });
  },

  handleSelect(e) {
    const newClass = Object.assign({}, this.state.classroom);
    newClass.grade = e;
    this.setState({ classroom: newClass, });
  },

  clickCreateAClass() {
    const classroom = this.state.classroom;
    if (classroom.name && classroom.grade) {
      this.submitClassroom();
    } else {
      const missingValue = classroom.name ? 'grade' : 'name';
      this.setState({ errors: `You must choose your classroom's ${missingValue} before continuing.`, });
    }
  },

  submitClassroom() {
    this.setState({ loading: true, });
    const that = this;
    $.post('/teachers/classrooms/', { classroom: this.state.classroom, })
        .success((data) => {
          let nextPage;
          if (that.props.closeModal) {
              // only used if it is rendered within a modal
            that.props.closeModal('because class added');
          } else if (that.props.hasClassroomActivities === false) {
            window.location.assign('/teachers/classrooms/assign_activities');
          } else if (data.toInviteStudents) {
            window.location.assign('/teachers/classrooms/invite_students');
          } else {
            window.location.assign('/teachers/classrooms/scorebook');
          }
        })
        .error((data) => {
          that.setState({ loading: false, });
          const errors = JSON.parse(data.responseText).errors;
          const errorMessage = errors.join('\n');
          that.setState({ errors: errorMessage, });
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

  createButton() {
    return this.state.loading
    ? <button className="button-grey submit-button"><ButtonLoadingIndicator/></button>
    : <button className="button-green submit-button" onClick={this.clickCreateAClass}>Create a Class</button>
  },

  formatTitle() {
    const classroom = this.state.classroom;
    if (classroom.grade) {
      return classroom.grade == 'University' || classroom.grade == 'Other' ? classroom.grade : `${NumberSuffix(classroom.grade)} Grade`;
    }
    return 'Select Grade';
  },

  render() {
    const classroom = this.state.classroom;
    return (
      <div className="create-a-class-page">
        <div className="create-a-class">
          <div>
            <div id="new-classroom">
              <h1>Create Your Class</h1>
              <p>After you create a class, you can create students’ accounts or have your students sign up with a class code.</p>
              <div className="input-row">
                <label htmlFor="class-name">Class Name:</label>
                <input type="text" id="class-name" placeholder="e.g. 6th Period ELA" value={classroom.name} onChange={this.handleChange} />
              </div>
              <div className="input-row">
                <label htmlFor="">Grade:</label>
                <DropdownButton className={classroom.grade ? 'has-grade' : null} bsStyle="default" id="select-grade" title={this.formatTitle()} onSelect={this.handleSelect}>
                  {this.grades()}
                </DropdownButton>
              </div>
              <div className="input-row">
                <label htmlFor="classroom_code">Class Code:</label>
                <input className="inactive class-code text-center" disabled="true" type="text" value={classroom.code} name="classroom[code]" id="classroom_code" />
              </div>
              <div id="regenerate-class-code" onClick={this.getClassCode}><span><i className="fa fa-refresh" />Regenerate Class Code</span></div>
              {this.createButton()}
              <h4 className="errors">{this.state.errors}</h4>
            </div>
            <div id="new-google-classroom">
              <h1>Google Classroom User? <img src="/images/google_classroom_icon.png" data-pin-nopin="true" /></h1>
              <p>If you have an account with Google Classroom, you can import all your classes and students to Quill.</p>
              <button className="button-green" onClick={this.syncOrModal}>Import From Google Classroom</button>
              <GoogleClassroomModal syncClassrooms={this.syncClassrooms} user={this.props.user} show={this.state.showModal} hideModal={this.hideModal} />
            </div>
          </div>
        </div>
      </div>);
  },
});
