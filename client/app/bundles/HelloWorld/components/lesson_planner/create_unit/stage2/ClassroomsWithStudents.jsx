import React from 'react'
import Classroom from './classroom.jsx'
import UpdateUnitButton from './update_unit_button.jsx'

export default class extends React.Component {

	resetPage() {
		window.location = `/teachers/classrooms/lesson_planner#${this.props.unitId}`
	}

	classroomActivityUpdates() {
		const classrooms_data = []
		this.props.classrooms.forEach((classy) => {
			if (classy.edited) {
				const class_data = {id: classy.id}
				// class_data.id = classy.classroom_activity ? classy.classroom_activity.id : undefined
				if (classy.allSelected) {
					class_data.student_ids = []
				} else {
					const student_ids_arr = []
					classy.students.forEach((stud) => {
						if (stud.isSelected) {
							student_ids_arr.push(stud.id)
						}
					})
					if (student_ids_arr.length > 0) {
						class_data.student_ids = student_ids_arr
					} else {
						class_data.students_ids = false
					}
				}
				classrooms_data.push(class_data)
			}
		})
		return classrooms_data
	}

	ajaxData = () => {
		return {classrooms_data: this.classroomActivityUpdates()}
	}

	render() {
		let classroomList;
		if (this.props.classrooms) {
			let that = this;
			classroomList = this.props.classrooms.map((el)=> {
				return <Classroom    key = {el.id}
														 classroom={el}
														 students={el.students}
														 allSelected={el.allSelected}
														 toggleClassroomSelection={that.props.toggleClassroomSelection}
														 handleStudentCheckboxClick={that.props.handleStudentCheckboxClick} />;

			})
		} else {
			// TODO: make this a message that they don't have any classrooms
			classroomList = []
		}
    return (
			<div>
				<h2 className='edit-students-h2'>Edit Students for {this.props.unitName}</h2>
				{classroomList}
				<UpdateUnitButton enabled={this.props.saveButtonEnabled}
													disabledText={'Edit Students To Save'}
													putUrl={`/teachers/units/${this.props.unitId}/update_classroom_activities_assigned_students`}
													successCallback={this.resetPage}
													buttonText={'Update Students'}
													dataFunc={this.ajaxData}
													/>
			</div>
    );
	}

}
