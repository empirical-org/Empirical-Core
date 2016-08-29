import React from 'react'
import _ from 'lodash'
import ClassroomDropdown from '../components/general_components/dropdown_selectors/classroom_dropdown.jsx'
import $ from 'jquery'
import ClassroomsStudentsTable from '../components/general_components/classrooms_students_table.jsx'
import LoadingSpinner from '../components/general_components/loading_indicator.jsx'

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
			loading: true
		})
	},

	componentDidMount: function() {
		this.retrieveStudents()
	},

	retrieveStudents: function() {
		let that = this;
		$.ajax({url: `/teachers/classrooms/${this.state.selectedClassroom.id}/students`}).success(function(data) {
      that.setState({students: data.students, loading: false})
		});
	},

	updateClassroom: function(classroom) {
		this.setState({selectedClassroom: classroom, loading: true})
		this.retrieveStudents();
	},

	stateSpecificComponent: function() {
		if (this.state.loading) {
			return <LoadingSpinner/>
		} else {
			return <ClassroomsStudentsTable students={this.state.students}/>
		}
	},

	render: function() {
		return (
			<div className="container invite-students">
				<div className="row">
					<div className="col-xs-12 col-sm-6 col-md-6 col-lg-5 col-xl-5 button-select-wrapper select-white-wrapper">
						<div className="button-select">
							<ClassroomDropdown classrooms={this.props.classrooms} callback={this.updateClassroom}/>
						</div>
					</div>
				</div>
				<h1 className="section-header">
					Have Students Create Their Accounts
				</h1>
				<ol>
					<li>
						Have students sign up at quill.org/account/new
					</li>
					<li>
						Once students sign up, in the "Join My Class" field,
						<br/>they enter the class code
						<strong>prize-bait</strong>
					</li>
				</ol>
				<span className="class-code">Class Code</span><input className="inactive" disabled="" type="text" value="prize-bait"/>
				<h1 className="section-header">
					Or You Create Student Accounts
				</h1>
				<div>
					The students’ usernames are their names combined with your<br/>class code. For example, John Smith is 'John.Smith@prize-bait'.<br/>
					<div className="mt-15">
						Students passwords are set to their last names by default.<br/>For example, ‘Smith’ (first letter is capitalized).
					</div>
				</div>
				{this.stateSpecificComponent()}
			</div>
		);
	}
})
