'use strict'

 import React from 'react'
 import _ from 'underscore'
 import ClassroomActivity from './classroom_activity'

 export default  React.createClass({
	hideUnit: function () {
		var x = confirm("Are you sure you want to delete this Activity Pack? \n \nIt will delete all assignments given to students associated with this pack, even if those assignments have already been completed.");
		if (x) {
			this.props.hideUnit(this.props.data.unit.id);
		}
	},

	assignedToText: function () {
		var studentNoun, classroomNoun, classroomsString;
		if (this.props.data.num_students_assigned === 1) {
			studentNoun = " Student";
		} else {
			studentNoun = " Students";
		}
		if (this.props.data.classrooms.length > 1) {
			classroomNoun = " classes";
		} else {
			classroomNoun = " class";
		}

		classroomsString = " ("
		for (var i=0; i<this.props.data.classrooms.length; i++) {
			var add;
			if (i < this.props.data.classrooms.length -1) {
				add = this.props.data.classrooms[i].name + ", ";
			} else {
				add = this.props.data.classrooms[i].name + ")";
			}
			classroomsString = classroomsString + add;
		}

		var txt = "Assigned to "
		+ this.props.data.num_students_assigned
		+ studentNoun
		+ " in " + this.props.data.classrooms.length + classroomNoun
		+ classroomsString
		return txt;
	},

	editUnit: function () {
		this.props.editUnit(this.props.data.unit.id)
	},

	render: function () {
		var classroomActivities = _.map(this.props.data.classroom_activities, function (ca) {
			return (<ClassroomActivity
							key={ca.id}
							updateDueDate={this.props.updateDueDate}
							deleteClassroomActivity={this.props.deleteClassroomActivity}
							data={ca} />);
		}, this);

		return (
			<section >
				<div className="row vertical-align">
					<h3 className="col-md-9 vcenter">{this.props.data.unit.name}</h3>
					<div className="col-md-3 vcenter pull-right delete-unit"><span onClick={this.hideUnit}>Delete</span></div>
				</div>
				<div className="unit-label row">
					<div className='col-md-9'> {this.assignedToText()}</div>
          <div className='col-md-3 due-date-header'>Due Date</div>
				</div>
				<div className="table assigned-activities">
					{classroomActivities}
				</div>
			</section>
		);
	}
});
