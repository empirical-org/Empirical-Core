import React from 'react'
import Classroom from './classroom.jsx'

export default class extends React.Component {



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
														 toggleStudentSelection={that.props.toggleStudentSelection} />;

			})
		} else {
			// TODO: make this a message that they don't have any classrooms
			classroomList = []
		}

    return (
			<div>{classroomList || 'I am the div that is undefined'}</div>
    );
	}

}
