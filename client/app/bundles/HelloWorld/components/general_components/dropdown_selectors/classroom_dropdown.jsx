import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import {Router, Route, Link, hashHistory} from 'react-router';
import $ from 'jquery'

export default React.createClass({

	propTypes: {
		classrooms: React.PropTypes.array.isRequired,
    callback: React.PropTypes.func
	},

	getInitialState: function() {
		return ({selectedClassroom: this.props.selectedClassroom || this.props.classrooms[0]});
	},

	classrooms: function() {
		return this.props.classrooms.map((classroom) => <MenuItem key={classroom.id} eventKey={classroom.id}>{classroom ? classroom.name : ''}</MenuItem>)
	},

  findClassroomById: function(id) {
    return this.props.classrooms.find((c) => c.id === id)
  },

	handleSelect: function(classroomId) {
		let classroom = this.findClassroomById(classroomId)
		this.setState({selectedClassroom: classroom})
    if (this.props.callback) {
      this.props.callback(classroom)
    }
	},

	render: function() {
		return (
			<DropdownButton disabled={!this.props.classrooms.length} bsStyle='default' title={this.state.selectedClassroom ? this.state.selectedClassroom.name : ''} id='select-classroom-dropdown' onSelect={this.handleSelect}>
				{this.classrooms()}
			</DropdownButton>
		);
	}

});
