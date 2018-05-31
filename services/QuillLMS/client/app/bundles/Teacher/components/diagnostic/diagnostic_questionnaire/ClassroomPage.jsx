import React from 'react';
import $ from 'jquery';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { Router, Route, Link, hashHistory } from 'react-router';
import NumberSuffix from '../../modules/numberSuffixBuilder.js';
import Modal from 'react-bootstrap/lib/Modal';
import CreateClass from '../../../containers/CreateClass.jsx';
import Classroom from '../../lesson_planner/create_unit/stage2/classroom';
import LoadingSpinner from '../../shared/loading_indicator.jsx';

export default React.createClass({

  componentDidMount() {
    this.getTeacher();
  },

  getInitialState() {
    return ({
      loading: true,
      classrooms: null,
      showModal: false,
      hiddenButton: true,
      selectedClassrooms: [],
      user: {},
    });
  },

  getClassrooms() {
    const that = this;
    $.ajax('/teachers/classrooms_i_teach_with_students').done((data) => {
      const classrooms = that.addClassroomProps(data.classrooms);
      that.setState({ classrooms, });
    }).fail(() => {
      alert('error');
    }).always(() => {
      that.setState({ loading: false, });
    });
  },

  getTeacher() {
    const that = this;
    $.get('/current_user_json').done((data) => {
      that.setState({ user: data, }, that.getClassrooms());
    });
  },

  updateSelectedClassrooms() {
    const newState = Object.assign({}, this.state);
    const classrooms = this.state.classrooms;
    const checkedClassrooms = [];
    classrooms.forEach((c) => {
      if (c.checked) {
        checkedClassrooms.push({ id: c.id, student_ids: [], assign_on_join: true, });
      } else if (c.selectedStudentIds.length > 0) {
        checkedClassrooms.push({ id: c.id, student_ids: c.selectedStudentIds, assign_on_join: c.assign_on_join, });
      }
    });
    newState.selectedClassrooms = checkedClassrooms;
    newState.hiddenButton = checkedClassrooms.length < 1;
    this.setState(newState);
  },

  toggleStudentSelection(studentIndex, classIndex) {
    const newState = Object.assign({}, this.state);
    const classy = newState.classrooms[classIndex];
	  const selectedStudent = classy.students[studentIndex];
    selectedStudent.isSelected = !selectedStudent.isSelected;
    if (selectedStudent.isSelected) {
      classy.selectedStudentIds.push(selectedStudent.id);
    } else {
      const index = classy.selectedStudentIds.indexOf(selectedStudent.id);
      classy.selectedStudentIds.splice(index, 1);
    }
    classy.assign_on_join = classy.selectedStudentIds.length === classy.students.length;
    this.setState(newState, () => this.updateSelectedClassrooms());
  },

  handleStudentCheckboxClick(studentId, classroomId) {
    const classIndex = this.findTargetClassIndex(classroomId);
    const studentIndex = this.findTargetStudentIndex(studentId, classIndex);
    this.toggleStudentSelection(studentIndex, classIndex);
  },

  toggleClassroomSelection(classy) {
    const newState = Object.assign({}, this.state);
    const classIndex = this.findTargetClassIndex(classy.id);
    const classroom = newState.classrooms[classIndex];
    classroom.checked = !classroom.checked;
    classroom.assign_on_join = classroom.checked;
    classroom.students.forEach(stud => stud.isSelected = classroom.checked);
    this.setState(newState, () => this.updateSelectedClassrooms());
  },

  findTargetClassIndex(classroomId) {
    return this.state.classrooms.findIndex(classy => classy.id === classroomId);
  },

  findTargetStudentIndex(studentId, targetClassIndex) {
    return this.state.classrooms[targetClassIndex].students.findIndex(
			stud => stud.id === studentId);
  },

  assignedClassData() {
    let name,
      unit_template_id;
    if (this.props.diagnosticActivityId === 413) {
      unit_template_id = 20;
      name = 'Sentence Structure Diagnostic';
    } else if (this.props.diagnosticActivityId === 447) {
      unit_template_id = 34;
      name = 'ELL Diagnostic';
    }

    return ({
      unit: {
        name,
        unit_template_id,
        classrooms: this.state.selectedClassrooms,
        activities: [
          {
            id: this.props.diagnosticActivityId,
          }
        ],
      },
    });
  },

  submitClasses() {
    this.setState({ hiddenButton: true, });
    const data = this.assignedClassData();
    const that = this;
    if (data.unit.classrooms.length < 1) {
      alert('You must select a classroom before assigning the diagnostic.');
    } else {
      $.ajax({ type: 'POST', url: '/teachers/units', data: JSON.stringify(data), dataType: 'json', contentType: 'application/json', }).done(() => {
        window.location = `/diagnostic/${that.props.diagnosticActivityId}/success`;
      }).fail(() => {
        alert('There has been an error assigning the lesson. Please make sure you have selected a classroom');
      });
    }
  },

  grades() {
    const grades = [];
    for (let grade = 1; grade <= 12; grade++) {
      grades.push(
        <MenuItem key={grade} eventKey={grade}>{this.readingLevelFormatter(grade)}</MenuItem>
			);
    }
    return grades;
  },

  addClassroomProps(classrooms) {
    let updatedClassrooms;
    if (this.state.selectedClassrooms) {
      const selectedClassroomIds = this.state.selectedClassrooms.map(classy => classy.id);
      updatedClassrooms = classrooms.map((classy) => {
        classy.checked = selectedClassroomIds.includes(classy.id);
        classy.selectedStudentIds = [];
        return classy;
      });
    } else {
      updatedClassrooms = classrooms.map((classy) => {
        classy.checked = false;
        classy.selectedStudentIds = [];
        return classy;
      });
    }
    return updatedClassrooms;
  },

  readingLevelFormatter(num) {
    return num
			? `${NumberSuffix(num)} grade reading level`
			: null;
  },

  handleSelect(index, grade) {
    const updatedClassrooms = this.state.classrooms.slice(0);
    updatedClassrooms[index].selectedGrade = grade;
    this.setState({ classrooms: updatedClassrooms, });
  },

  handleChange(index) {
    const updatedClassrooms = this.state.classrooms.slice(0);
    updatedClassrooms[index].checked = !updatedClassrooms[index].checked;
    this.setState({ classrooms: updatedClassrooms, }, this.updateSelectedClassrooms);
  },

  buildClassRow(classy, index) {
		// The commented out portions are so we can add the reading level once we bring back that feature
    const currClass = this.state.classrooms[index];
		// let that = this
		// let readingLevel = function() {
		// 	let input = currClass.selectedGrade || classy.grade || 'Select a Reading Level'
		// 	return input === 'Select a Reading Level'
		// 		? input
		// 		: that.readingLevelFormatter(input)
		// }
    return (
      <Classroom
        students={classy.students}
        classroom={classy}
        allSelected={classy.allSelected}
        toggleClassroomSelection={this.toggleClassroomSelection}
        handleStudentCheckboxClick={this.handleStudentCheckboxClick}
      />
    );
  },

  classroomTable() {
    if (this.state.loading) {
			// return loading image
    } else if (this.state.classrooms === [] || this.state.classrooms === null) {
      return <span />;
    } else {
      const rows = this.state.classrooms.map((classy, index) => this.buildClassRow(classy, index));
      return <div className="edit-assigned-students-container">{rows}</div>;
    }
  },

  showModal() {
    this.setState({ showModal: true, });
  },

  hideModal(becauseClassAdded) {
    if (becauseClassAdded) {
      this.getClassrooms();
    }
    this.setState({ showModal: false, });
  },

  modal() {
    return (
      <Modal {...this.props} show={this.state.showModal} onHide={this.hideModal} dialogClassName="add-class-modal">
        <Modal.Body>
          <img className="pull-right react-bootstrap-close" onClick={this.hideModal} src={`${process.env.CDN_URL}/images/shared/close_x.svg`} alt="close-modal" />
          <CreateClass closeModal={this.hideModal} user={this.state.user} />
        </Modal.Body>
      </Modal>
    );
  },

  render() {
    const content = this.state.loading
			? <LoadingSpinner />
			: this.classroomTable();
    const display = {
      display: this.state.hiddenButton
				? 'none'
				: null,
    };
    return (
      <div id="assign-page">
        <div>
          <h2>Which classes would you like to assign the diagnostic to?</h2>
          <span id="subtext">Students will be able to complete the diagnostic once they join a class.</span>
          {/* <a href='/placeholder'>How should I determine the reading level of my classes?</a>*/}
        </div>
        {content}
        <div id="footer-buttons">
          <div className="pull-left text-center">
            <button className="button button-transparent" id="add-a-class-button" onClick={this.showModal}>Add a Class</button>
            {this.modal()}
          </div>
          <div className="pull-right text-center">
            <button style={display} onClick={this.submitClasses} className="button-green" id="save-and-assign-button">Save & Assign</button>
            <br />
            <Link to={`/diagnostic/${this.props.diagnosticActivityId}/stage/2`}>Back</Link>
          </div>
        </div>
      </div>
    );
  },
});
