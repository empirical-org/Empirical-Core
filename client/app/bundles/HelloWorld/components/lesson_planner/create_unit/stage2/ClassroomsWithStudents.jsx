import React from 'react'
import Classroom from './classroom.jsx'
import UpdateUnitButton from './update_unit_button.jsx'

export default class extends React.Component {

	resetPage() {
		window.location = '/teachers/classrooms/lesson_planner'
	}

	orderAssignedStudentIds() {
		const newState = Object.assign({}, this.state);
		const classrooms = this.newState.classrooms
		const assignedStudentData = {};
		classrooms.forEach((classy) => {
			if (classy.edited) {
				if (classy.allSelected) {
					// assigned students = all
				}
			}
			// if (classy.classroom_activity) {
			// 	classy.classroom_activity.new_assigned_student_ids = classy.students.map((stud) => {
			// 		if (stud.isSelected) {
			// 			return stud.id
			// 		}
			// 	})
			// }
		})
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
													data={this.props.classrooms}
													/>
			</div>
    );
	}

}
