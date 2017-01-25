'use strict'

 import React from 'react'
 import _ from 'underscore'
 import ClassroomActivity from './classroom_activity'
 import Pluralize from 'pluralize'
 import request from 'request'

 export default  React.createClass({
  getInitialState: function () {
    return {edit: false,
    unitName: this.props.data.unit.name}
  },

	hideUnit: function () {
		var x = confirm('Are you sure you want to delete this Activity Pack? \n \nIt will delete all assignments given to students associated with this pack, even if those assignments have already been completed.');
		if (x) {
			this.props.hideUnit(this.props.data.unit.id);
		}
	},

	assignedToText: function () {
    const studentCount = this.props.data.num_students_assigned
    const classroomCount = this.props.data.classrooms.length

    let students, classrooms, classroomsString
    students = Pluralize('Student', studentCount)
    classrooms = Pluralize('class', classroomCount)

    classroomsString = ''
    this.props.data.classrooms.forEach((classroom, index, classList) => {
      if (index < classList.length - 1) {
        classroomsString += classroom.name + ', '
      } else {
        classroomsString += classroom.name
      }
    })

		return <span>{`Assigned to ${studentCount} ${students} in
    ${this.props.data.classrooms.length} ${classrooms} (${classroomsString}).`}</span>
	},

	editUnit: function () {
		this.props.editUnit(this.props.data.unit.id)
	},

  delete: function(){
    if (!this.props.report) {
      return <span className='delete-unit' onClick={this.hideUnit}>Delete</span>
    }
  },

  editName: function(){
    return <span className="edit-unit" onClick={this.changeToEdit}>Edit Name</span>
  },

  submitName: function(){
    return <span className="edit-unit" onClick={this.handleSubmit}>Submit</span>
  },


  dueDate: function(){
    if (!this.props.report) {
      return <span className='due-date-header'>Due Date</span>
    }
  },

  changeToEdit: function(){
    this.setState({edit: true})
  },

  handleNameChange: function(e){
    this.setState({unitName: e.target.value}, console.log(this.state.unitName))
  },

  editUnitName: function(){
    return <input type='text' onChange={this.handleNameChange} value={this.state.unitName}/>
  },

  handleSubmit: function(){
    request.put('/teachers/units/', {name: this.state.unitName})
  },

  showUnitName: function(){
    return <span className="h-pointer">{this.state.unitName}</span>;
  },

  showOrEditName: function(){
    return this.state.edit ? this.editUnitName() : this.showUnitName();
  },

	render: function () {
		var classroomActivities = _.map(this.props.data.classroom_activities, function (ca) {
			return (<ClassroomActivity
							key={ca.id}
              report={this.props.report}
							updateDueDate={this.props.updateDueDate}
							deleteClassroomActivity={this.props.deleteClassroomActivity}
							data={ca} />);
		}, this);
		return (
			<section >
				<div className='row unit-header-row'>
            <span className="unit-name">
              {this.showOrEditName()}
            </span>
            {this.state.edit ? this.submitName() : this.editName()}
					{this.delete()}
				</div>
				<div className='unit-label row'>
          {this.assignedToText()}
          {this.dueDate()}
				</div>
				<div className='table assigned-activities'>
					{classroomActivities}
				</div>
			</section>
		);
	}
});
