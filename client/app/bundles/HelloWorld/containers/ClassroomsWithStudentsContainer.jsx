'use strict'
import React from 'react'
import ClassroomsWithStudents from '../components/lesson_planner/create_unit/stage2/ClassroomsWithStudents.jsx'

import LoadingIndicator from '../components/general_components/loading_indicator.jsx'

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.getClassroomsAndStudentsData();
	}

	state = {
		classrooms: null,
		loading: true,
		studentsChanged: false
	}

	findTargetClassIndex(classroomId) {
		return this.state.classrooms.findIndex((classy)=>{
			return classy.id === classroomId
		})
	}

	findTargetStudentIndex(studentId, targetClassIndex) {
		return this.state.classrooms[targetClassIndex].students.findIndex(
			(stud)=>{
				return stud.id===studentId
		})
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
	toggleStudentSelection = (studentIndex, classIndex) => {
		const newState = Object.assign({}, this.state);
	  let selectedStudent = newState.classrooms[classIndex].students[studentIndex]
		selectedStudent.isSelected = !selectedStudent.isSelected;
		this.setState(newState)
	}

	handleStudentCheckboxClick = (studentId, classroomId) =>{
		const classIndex = this.findTargetClassIndex(classroomId)
		const studentIndex = this.findTargetStudentIndex(studentId, classIndex)
		this.setState({studentsChanged: true}, () => this.toggleStudentSelection(studentIndex, classIndex));
	}

	toggleClassroomSelection = (classy) => {
		const newState = Object.assign({}, this.state);
		const classIndex = this.findTargetClassIndex(classy.id);
		const classroom = newState.classrooms[classIndex];
		classroom.allSelected = !classroom.allSelected;
		classroom.students.forEach((stud)=>stud.isSelected=classroom.allSelected);
		newState.studentsChanged = true;
		this.setState(newState);
	}

	selectPreviouslyAssignedStudents() {
	// 	// @TODO if (window.location.pathname.includes('edit')) {
			this.state.classrooms.forEach((classy, classroomIndex) => {
				if (classy.classroom_activity) {
						if (classy.classroom_activity.assigned_student_ids.length > 0) {
							classy.classroom_activity.assigned_student_ids.forEach((studId) => {
								let studIndex = this.findTargetStudentIndex(studId, classroomIndex);
								this.toggleStudentSelection(studIndex, classroomIndex)
							})
						} else {
							classy.students.forEach((stud, studIndex) => {
								this.toggleStudentSelection(studIndex, classroomIndex)
						})
					}
				}
			})
		// }
	}

	getClassroomsAndStudentsData() {
		const that = this;
		$.ajax({
			type: 'GET',
			url: '/teachers/units/69284/classrooms_with_students_and_classroom_activities',
			data: {unit: {name: that.state.unitName}},
			statusCode: {
				200: function(data) {
					that.setState({loading: false, classrooms: data.classrooms})
					that.selectPreviouslyAssignedStudents()
				},
				422: function(response) {
					that.setState({errors: response.responseJSON.errors,
					loading: false})
				}
			}
		})
	}

	render() {
		if (this.state.loading) {
			return <LoadingIndicator/>
		} else if (this.state.classrooms) {
			return <ClassroomsWithStudents
									classrooms={this.state.classrooms}
									handleStudentCheckboxClick={this.handleStudentCheckboxClick.bind(this)}
									toggleClassroomSelection={this.toggleClassroomSelection}
									showSaveButton={this.state.studentsChanged}
									/>
		} else {
			return <div>You must first add a classroom.</div>
		}
	}

}
