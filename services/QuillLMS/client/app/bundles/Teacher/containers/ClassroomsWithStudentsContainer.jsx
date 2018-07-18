import React from 'react';
import $ from 'jquery';
import ClassroomsWithStudents from '../components/lesson_planner/create_unit/stage2/ClassroomsWithStudents.jsx';
import LoadingIndicator from '../components/shared/loading_indicator.jsx';
import _ from 'underscore';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      classrooms: null,
      loading: true,
      studentsChanged: false,
      classroomsChanged: false,
      newUnit: !!this.props.params.activityIdsArray,
    };
    this.getClassroomsAndStudentsData();
  }

  findTargetClassIndex(classroomId) {
    return this.state.classrooms.findIndex(classy => classy.id === classroomId);
  }

  findTargetStudentIndex(studentId, targetClassIndex) {
    return this.state.classrooms[targetClassIndex].students.findIndex(
			stud => stud.id === studentId);
  }

	// Emilia and Ryan discussed that it may make more sense for the AJAX
	// call to return a data structure like:
	// {
	//   classrooms: [{
	//     id: 23,
	//     name: 'English 2',
	//     students: {
	//       12323: {
	//         'Ryan'
	//       }
	//     }
	//   }]
	// ]
	// units: [
	//   id: 1232,
	//   name: 'Adjectives',
	//   classroom_activities: [{
	//     classroom: 23,
	//     assigned_student_ids: [23]
	//   }]
	// ]
	// }
	// this would allow us to iterate over the assigned_student_ids
	// and then change the students to selected/not selected based off of the results
	//
  toggleStudentSelection = (studentIndex, classIndex) => {
    const newState = Object.assign({}, this.state);
    const classy = newState.classrooms[classIndex];
	  const selectedStudent = classy.students[studentIndex];
    selectedStudent.isSelected = !selectedStudent.isSelected;
    newState.classrooms[classIndex].edited = this.classroomUpdated(newState.classrooms[classIndex]);
    newState.studentsChanged = this.studentsChanged(newState.classrooms);
		// we check to see if something has changed because this method gets called when the page loads
		// as well as when a student's checkbox is clicked
    if (newState.studentsChanged) {
      const selectedCount = this.countAssigned(classy);
      this.updateAllOrNoneAssigned(classy, selectedCount);
    }
    this.setState(newState);
  }

  handleStudentCheckboxClick = (studentId, classroomId) => {
    const classIndex = this.findTargetClassIndex(classroomId);
    const studentIndex = this.findTargetStudentIndex(studentId, classIndex);
    this.toggleStudentSelection(studentIndex, classIndex);
  }

  toggleClassroomSelection = (classy) => {
    const newState = Object.assign({}, this.state);
    const classIndex = this.findTargetClassIndex(classy.id);
    const classroom = newState.classrooms[classIndex];
    if (this.state.newUnit && classroom.allSelected) {
      // if the classroom is currently allSelected, it has been unselected, so if the unit is new it has not been edited
      delete classroom.edited
      delete classroom.allSelected
      delete classroom.noneSelected
      classroom.students.forEach(stud => stud.isSelected = false)
    } else {
      classroom.allSelected = !classroom.allSelected;
      classroom.noneSelected = !classroom.allSelected;
      classroom.students.forEach(stud => stud.isSelected = classroom.allSelected);
      classroom.edited = this.classroomUpdated(classroom)
    }
    newState.studentsChanged = !!this.studentsChanged(newState.classrooms);
    newState.classroomsChanged = !!newState.classrooms.find(c => this.classroomUpdated(c))
    this.setState(newState);
  }

  selectPreviouslyAssignedStudents() {
	// 	// @TODO if (window.location.pathname.includes('edit')) {
    const that = this;
    const newState = Object.assign({}, this.state);
    newState.classrooms.forEach((classy, classroomIndex) => {
      const ca = classy.classroom_unit;
      let selectedCount = 0;
      if (ca) {
        if (ca.assigned_student_ids && ca.assigned_student_ids.length > 0) {
          ca.assigned_student_ids.forEach((studId) => {
            const studIndex = that.findTargetStudentIndex(studId, classroomIndex);
								// only do this if the student is still in the classroom
								// otherwise, we may have assigned students that have left the classroom
            if (studIndex !== -1) {
              that.toggleStudentSelection(studIndex, classroomIndex);
              selectedCount += 1;
            }
          });
        } else {
          classy.students.forEach((stud, studIndex) => {
            that.toggleStudentSelection(studIndex, classroomIndex);
            selectedCount += 1;
          });
        }
      }
      that.updateAllOrNoneAssigned(classy, selectedCount);
    });
    this.setState(newState);
  }

  updateAllOrNoneAssigned(classy, selectedCount) {
    if ((classy.students.length && (selectedCount === classy.students.length)) || (classy.students.length === 0 && classy.classroom_activity)) {
      classy.allSelected = true;
      classy.noneSelected = false;
    } else if (classy.students.length && selectedCount === 0) {
      classy.noneSelected = true;
      classy.allSelected = false;
    } else {
      classy.allSelected = false;
      classy.noneSelected = false;
    }
  }

  countAssigned = classy => classy.students.filter(student => student.isSelected).length

  getAssignedIds = classy => classy.students.filter(student => student.isSelected).map(stud => stud.id)

  classroomUpdated(classy) {
    const assignedStudentIds = this.getAssignedIds(classy).sort();
    let updated;
    if (classy.classroom_activity) {
      const ca = classy.classroom_activity;
      if (ca.assign_on_join) {
				// if everyone in class was assigned, check to see if assignedStudentIds length is equal to number of students in class
				// if it is, there hasn't been an update unless there are no students in the class
        const equalLengths = assignedStudentIds.length === classy.students.length;
				// this handles the edge case where a classroom with no students has an activity assigned,
				// because if that class does have a classroom activity it would initially have allSelected = true, not noneSelected
        updated = classy.students.length === 0 && classy.noneSelected ? true : !equalLengths;
      } else {
				// if not everyone in the class was assigned, check to see if assigned student arrays are the same
        updated = !_.isEqual(assignedStudentIds, ca.assigned_student_ids.filter(Number).sort());
      }
    } else if (assignedStudentIds.length > 0 || classy.allSelected) {
			// if there were no students assigned but there are now,
			// or everyone is selected (in the case of an empty classroom), students have been added
      updated = true;
    } else {
      updated = false;
    }
    return updated;
  }

  studentsChanged(classrooms) {
    let changed;
    classrooms.forEach((classy) => {
      if (this.classroomUpdated(classy)) {
        changed = true;
      }
    });
    return changed;
  }

  getClassroomsAndStudentsData() {
    const that = this;
    let url,
      unitName;
    if (this.state.newUnit) {
      url = '/teachers/classrooms_i_teach_with_students';
      unitName = () => this.props.params.unitName;
    } else {
      url = `/teachers/units/${that.props.params.unitId}/classrooms_with_students_and_classroom_units`;
      unitName = data => data.unit_name;
    }
    $.ajax({
      type: 'GET',
      url,
      dataType: 'json',
      statusCode: {
        200(data) {
          that.setState({ loading: false, classrooms: data.classrooms, unitName: unitName(data), });
          that.state.newUnit ? null : that.selectPreviouslyAssignedStudents();
        },
        422(response) {
          that.setState({ errors: response.responseJSON.errors,
            loading: false, });
        },
      },
    });
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    } else if (this.state.classrooms) {
      return (
        <div>
          <div className="container edit-assigned-students-container">
            <ClassroomsWithStudents
              unitId={this.props.params.unitId}
              unitName={this.state.unitName}
              classrooms={this.state.classrooms}
              activityIds={this.props.params.activityIdsArray}
              createOrEdit={this.state.newUnit ? 'create' : 'edit'}
              handleStudentCheckboxClick={this.handleStudentCheckboxClick.bind(this)}
              toggleClassroomSelection={this.toggleClassroomSelection}
              isSaveButtonEnabled={this.state.studentsChanged || this.state.classroomsChanged}
            />
          </div>
        </div>);
    }
    return <div>You must first add a classroom.</div>;
  }

}
