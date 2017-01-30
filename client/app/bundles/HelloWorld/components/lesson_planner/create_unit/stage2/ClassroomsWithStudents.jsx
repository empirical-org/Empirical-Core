import React from 'react'
import Classroom from './classroom.jsx'
import UpdateUnitButton from './update_unit_button.jsx'

export default class extends React.Component {

	resetPage() {
		window.location = '/teachers/classrooms/lesson_planner'
	}

	classroomActivityUpdates() {
		const classroomActivities = []
		this.props.classrooms.forEach((classy) => {
			if (classy.edited) {
				const class_act = {assigned_student_ids: undefined, classroom_id: classy.id}
				class_act.id = classy.classroom_activity ? classy.classroom_activity.id : undefined
				if (classy.allSelected) {
					class_act.assigned_student_ids = []
				} else {
					const student_ids_arr = []
					classy.students.forEach((stud) => {
						if (stud.isSelected) {
							student_ids_arr.push(stud.id)
						}
					})
					if (student_ids_arr.length > 0) {
						class_act.assigned_student_ids = student_ids_arr
					}
				}
				classroomActivities.push(class_act)
			}
		})
		return classroomActivities
	}

	ajaxData = () => {
		return {unit_id: undefined, classroom_activities: this.classroomActivityUpdates()}
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
				{classroomList}
				<UpdateUnitButton showButton={this.props.showSaveButton}
													putUrl={'/teachers/classroom_activities/'}
													successCallback={this.resetPage}
													buttonText={'Update Students'}
													dataFunc={this.ajaxData}
													/>
			</div>
    );
	}

}
