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
		return this.props.classrooms.map((classroom) => {
			if (!classroom.id) {
        // then we don't need ids
				return (<MenuItem key={classroom} eventKey={classroom}>{classroom}</MenuItem>)
			}
			return <MenuItem key={classroom.id} eventKey={classroom.id}>{classroom.name}</MenuItem>
		})
	},

  findClassroomByIdOrName: function(idOrName) {
    return this.props.classrooms.find((c) => {
			if (!c.id) {
        // then we're matching on name
				return c === idOrName
			}
			return c.id === id}
		)
  },

	handleSelect: function(classroomId) {
		let classroom = this.findClassroomByIdOrName(classroomId)
		this.setState({selectedClassroom: classroom})
    if (this.props.callback) {
      this.props.callback(classroom)
    }
	},

	render: function() {
		const title = this.state.selectedClassroom.name || this.state.selectedClassroom
		return (
			<DropdownButton disabled={!this.props.classrooms.length} bsStyle='default' title={title} id='select-classroom-dropdown' onSelect={this.handleSelect}>
				{this.classrooms()}
			</DropdownButton>
		);
	}

});
