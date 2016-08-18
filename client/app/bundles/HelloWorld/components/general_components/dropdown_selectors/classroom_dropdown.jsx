import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import {Router, Route, Link, hashHistory} from 'react-router';

export default React.createClass({

	propTypes: {
		classrooms: React.PropTypes.array.isRequired,
    defaultClassId: React.PropTypes.number,
    callback: React.PropTypes.function
	},

	getInitialState: function() {
		return ({selectedClassroom: this.findClassroomById(this.props.defaultClassId) || this.props.classrooms[0]});
	},

	classrooms: function() {
		return this.props.classrooms.map((classroom) => <MenuItem key={classroom.id} eventKey={classroom.id}>{classroom.name}</MenuItem>)
	},

  findClassroomById: function(id) {
    return this.props.classrooms.find((c) => c.id === id)
  },

	handleSelect: function(classroomId) {
		let newSelect = this.findClassroomById(classroomId);
		this.setState({selectedClassroom: newSelect})
    if (this.props.callback) {
      this.props.callback(classroomId)
    }
	},

	render: function() {
		return (
			<DropdownButton bsStyle='default' title={this.state.selectedClassroom.name} id='select-classroom-dropdown' onSelect={this.handleSelect}>
				{this.classrooms()}
			</DropdownButton>
		);
	}

});
