import React from 'react';
import Classroom from './classroom.jsx';
import EditStudentsButton from './EditStudentsButton.jsx';
import getParameterByName from '../../../modules/get_parameter_by_name.js';

export default class ClassroomsWithStudents extends React.Component {

  constructor() {
    super();
    this.ajaxData = this.ajaxData.bind(this);
    this.classroomUpdates = this.classroomUpdates.bind(this);
  }

  resetPage() {
    window.location = '/teachers/classrooms/lesson_planner';
  }

  classroomUpdates() {
    const classrooms_data = [];
    let classroomsWithNoAssignedStudents = 0;
    this.props.classrooms.forEach((classy) => {
      if (classy.edited) {
        const class_data = { id: classy.id, };
        if (classy.allSelected) {
          class_data.student_ids = classy.students.map(s => s.id);
          class_data.assign_on_join = true;
        } else {
          const student_ids_arr = [];
          class_data.assign_on_join = false;
          classy.students.forEach((stud) => {
            if (stud.isSelected) {
              student_ids_arr.push(stud.id);
            }
          });
          if (student_ids_arr.length > 0) {
            class_data.student_ids = student_ids_arr;
          } else {
            class_data.student_ids = false;
            classroomsWithNoAssignedStudents += 1;
          }
        }
        classrooms_data.push(class_data);
      }			else if (classy.noneSelected) {
        classroomsWithNoAssignedStudents += 1;
      }
    }
	);
    return classrooms_data;
  }

  ajaxData = () => {
    const data = { classrooms: JSON.stringify(this.classroomUpdates()), };
    if (this.props.createOrEdit === 'create') {
      data.create = true,
      data.unit_template_id = getParameterByName('unit_template_id');
      data.name = this.props.unitName,
			data.activities = JSON.stringify(this.props.activityIds.split(',').map(actId => ({ id: actId, due_date: null, })));
    }
    return data;
  }

  createButton() {
    return (
      <EditStudentsButton
        enabled={this.props.isSaveButtonEnabled}
        disabledText={'Add Students Before Assigning'}
        requestType={'POST'}
        url={'/teachers/units'}
        successCallback={this.resetPage}
        buttonText={'Assign Activity Pack'}
        dataFunc={this.ajaxData}
      />
    );
  }

  updateButton() {
    return (
      <EditStudentsButton
        enabled={this.props.isSaveButtonEnabled}
        disabledText={'Edit Students Before Saving'}
        requestType={'PUT'}
        url={`/teachers/units/${this.props.unitId}/update_classroom_unit_assigned_students`}
        successCallback={this.resetPage}
        buttonText={'Update Students'}
        dataFunc={this.ajaxData}
      />
    );
  }

  createOrUpdateButton() {
	 	return this.props.createOrEdit === 'create' ? this.createButton() : this.updateButton();
  }

  render() {
    let classroomList,
      warningBlurb;
    if (this.props.classrooms) {
      const that = this;
      classroomList = this.props.classrooms.map(el => <Classroom
        key={el.id}
        classroom={el}
        students={el.students}
        allSelected={el.allSelected}
        toggleClassroomSelection={that.props.toggleClassroomSelection}
        handleStudentCheckboxClick={that.props.handleStudentCheckboxClick}
      />);
    } else {
      classroomList = [];
    }
    if (this.props.createOrEdit === 'edit') {
      warningBlurb = <div className="unselecting-students-note">
        <i className="fa fa-icon fa-exclamation-circle"/>
        <p><span className="bold">Note:</span> If you unselect a student on this page, you will delete all of their assignments associated with this pack, even if those assignments <span className="italic">have already been completed</span>.</p>
      </div>;
    }
    return (
      <div>
        <h2 className="edit-students-h2">Edit Students for {this.props.unitName}</h2>
        {warningBlurb}
        {classroomList}
        {this.createOrUpdateButton()}
      </div>
    );
  }

}
