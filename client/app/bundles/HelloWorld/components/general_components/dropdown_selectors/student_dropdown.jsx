import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import {Router, Route, Link, hashHistory} from 'react-router';

export default React.createClass({

	propTypes: {
		students: React.PropTypes.array.isRequired,
    callback: React.PropTypes.function
	},

	getInitialState: function() {
			let initialStudent = this.props.students[0] || {name: 'No Students'};
			return ({selectedStudent: initialStudent});
	},

	componentWillReceiveProps: function(nextProps){
		if (nextProps.students.length) {
			this.setState({selectedStudent: nextProps.students[0]})
		}
	},


	students: function() {
		return this.props.students.map((student) => <MenuItem key={student.id} eventKey={student.id}>{student.name}</MenuItem>)
	},

  findStudentById: function(id) {
    return this.props.students.find((c) => c.id === id)
  },

	handleSelect: function(studentId) {
		this.setState({selectedStudent: this.findStudentById(studentId)})
    if (this.props.callback) {
      this.props.callback(studentId)
    }
	},

	render: function() {
			return (
				<DropdownButton bsStyle='default' title={this.state.selectedStudent.name} id='select-classroom-dropdown' onSelect={this.handleSelect}>
					{this.students()}
				</DropdownButton>
			);
	}

});
