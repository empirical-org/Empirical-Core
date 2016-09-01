import React from 'react'
import _ from 'lodash'
import ClassroomDropdown from '../components/general_components/dropdown_selectors/classroom_dropdown.jsx'
import $ from 'jquery'
import ClassroomsStudentsTable from '../components/general_components/classrooms_students_table.jsx'
import LoadingSpinner from '../components/general_components/loading_indicator.jsx'
import StudentCreatesAccountSection from '../components/invite_users/add_students/StudentCreatesAccountSection.jsx'
import TeacherCreatesAccountSection from '../components/invite_users/add_students/TeacherCreatesAccountSection.jsx'

export default React.createClass({

	propTypes: {
		classrooms: React.PropTypes.array.isRequired
	},

	getInitialState: function() {
		return ({
			selectedClassroom: this.props.classrooms[0] || [
				{
					name: 'No Classrooms',
					id: 0
				}
			],
			firstName: '',
			lastName: '',
			loading: true,
			errors: null,
			disabled: false
		})
	},

	componentDidMount: function() {
		this.retrieveStudents(this.state.selectedClassroom.id)
	},

	retrieveStudents: function(classroomId) {
		let that = this;
		$.ajax({url: `/teachers/classrooms/${classroomId}/students_list`}).success(function(data) {
			that.setState({students: data.students, loading: false})
		});
	},

	updateClassroom: function(classroom) {
		this.setState({selectedClassroom: classroom, loading: true})
		this.retrieveStudents(classroom.id);
	},

	stateSpecificComponent: function() {
		if (this.state.loading) {
			return <LoadingSpinner/>
		} else {
			return <ClassroomsStudentsTable key={'students-table'} students={this.state.students}/>
		}
	},

	nameChange: function(e, key) {
		let newNameState = {};
		newNameState[key] = e.target.value
		this.setState(newNameState)
	},

	submitStudent: function(e) {
		const firstName = this.state.firstName;
		const lastName = this.state.lastName;
		if (firstName && lastName) {
			this.setState({
				disabled: true,
				loading: true
			}, () => {
				let that = this
				$.post(`/teachers/classrooms/${this.state.selectedClassroom.id}/students`, {
					user: {
						first_name: firstName,
						last_name: lastName
					}
				}).done((data) => {
					const student = data.user
					let students = this.state.students.slice(0)
					students.unshift(student)
					that.setState({firstName: '', lastName: '', disabled: false, students: students, loading: false})
				})
			})
		} else {
			this.setState({errors: 'Student requires a first and last name', disabled: false})
		}
	},

	render: function() {
		return (
			<div className="container invite-students">
				<ClassroomDropdown classrooms={this.props.classrooms} callback={this.updateClassroom}/>
				<StudentCreatesAccountSection key='student-section' classCode={this.state.selectedClassroom.code}/>
				<TeacherCreatesAccountSection key="teacher-create-account" firstName={this.state.firstName} lastName={this.state.lastName} nameChange={this.nameChange} disabled={this.state.disabled} submitStudent={this.submitStudent} errors={this.state.errors}/> {this.stateSpecificComponent()}
			</div>
		);
	}
})
