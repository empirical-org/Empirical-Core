import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
// import {Router, Route, Link, hashHistory} from 'react-router';

export default React.createClass({

	propTypes: {
		students: React.PropTypes.array.isRequired,
    callback: React.PropTypes.func
	},

	getInitialState: function() {
		return this.checkStudents(this.props.students)
	},

	checkStudents: function(studentsProps){
		let studentProps = studentProps || this.props
		if (!studentProps.students || !studentProps.students.length) {
			return {selectedStudent: {name: 'No Students'}, disabled: true}
		} else {
			return {selectedStudent: studentProps.selectedStudent || studentProps.students[0]}
		}
	},

	componentWillReceiveProps: function(nextProps){
		this.setState(this.checkStudents(nextProps))
	},


	students: function() {
		if (!this.state.disabled) {
				return this.props.students.map((student, index) => <MenuItem key={`${student.id}+${index}`} eventKey={student.id}>{student.name}</MenuItem>)
		}
	},

  findStudentById: function(id) {
    return this.props.students.find((c) => c.id === id)
  },

	handleSelect: function(studentId) {
		//TODO: fix this. this part is redundant (the selectedStudent state is set from higher up),
		// but this potentially allows this class to be more modular and we are short ontime
		this.setState({selectedStudent: this.findStudentById(studentId)})
    if (this.props.callback) {
      this.props.callback(studentId)
    }
	},

	render: function() {
			return (
				<DropdownButton disabled={this.state.disabled} bsStyle='default' title={this.state.selectedStudent.name} id='select-student-dropdown' onSelect={this.handleSelect}>
					{this.students()}
				</DropdownButton>
			);
	}

});
