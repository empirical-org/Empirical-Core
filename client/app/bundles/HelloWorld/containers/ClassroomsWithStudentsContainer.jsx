import React from 'react'
import ClassroomsWithStudents from '../components/lesson_planner/create_unit/stage2/classroom.jsx'
import LoadingIndicator from '../components/general_components/loading_indicator.jsx'

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.getClassroomsAndStudentsData();
	}

	state = {
		classrooms: null,
		loading: true
	}

	getClassroomsAndStudentsData() {
		console.log('i\'ll get data');
	}



	render() {
		if (this.state.loading) {
			return <LoadingIndicator/>
		} else if (this.state.classrooms) {
			return <ClassroomsWithStudents/>
		} else {
			return <div>You must first add a classroom.</div>
		}
	}

}
