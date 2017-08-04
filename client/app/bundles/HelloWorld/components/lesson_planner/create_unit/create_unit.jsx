'use strict'

import React from 'react'
import UnitStage1 from './stage1/unit_stage1'
import Stage2 from './stage2/Stage2'
import UnitTemplatesAssigned from '../unit_template_assigned'
import ProgressBar from './progress_bar'
import _ from 'underscore'
import $ from 'jquery'

export default React.createClass({
	propTypes: {
		data: React.PropTypes.object.isRequired,
		actions: React.PropTypes.object.isRequired,
		analytics: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
			prohibitedUnitNames: [],
			newUnitId: null
		}
	},

	componentDidMount: function(){
		this.getProhibitedUnitNames()

	},

	getProhibitedUnitNames: function() {
	  const that = this;
		$.get('/teachers/prohibited_unit_names').done(function(data) {
			that.setState({prohibitedUnitNames: data.prohibitedUnitNames})
		});
	},

	isUnitNameUnique: function() {
		const unit = this.getUnitName();
		return !this.state.prohibitedUnitNames.includes(unit.toLowerCase());
	},

	getStage: function() {
		return this.props.data.createUnitData.stage;
	},

	getSelectedActivities: function() {
		return this.props.data.createUnitData.model.selectedActivities;
	},

	getClassrooms: function() {
		if (this.props.data.createUnitData.options) {
			return this.props.data.createUnitData.options.classrooms || [];
		} else {
			return undefined
		}

	},

	getUnitName: function() {
		return this.props.data.createUnitData.model.name || '';
	},

	getId: function() {
		return this.props.data.createUnitData.model.id;
	},

	toggleClassroomSelection: function(classroom) {
		var classrooms = this.getClassrooms();
		if (!classrooms) {
			return;
		}
		var updated = _.map(classrooms, function(c) {
			if (c.classroom.id == classroom.id) {
				if (c.students.length == 0) {
					c.emptyClassroomSelected = (this.toggleEmptyClassroomSelected(c));
				} else {
					var selected = _.where(c.students, {isSelected: true});
					var updatedStudents
					if (selected.length == c.students.length) {
						updatedStudents = _.map(c.students, function(s) {
							s.isSelected = false;
							return s;
						});
					} else {
						updatedStudents = _.map(c.students, function(s) {
							s.isSelected = true;
							return s;
						});
					}
					c.students = updatedStudents;
				}
			}
			return c;
		}, this);
		this.setState({classrooms: updated});
	},

	toggleStudentSelection: function(student, classroom, flag) {
		var updated = _.map(this.getClassrooms(), function(c) {
			if (c.classroom.id == classroom.id) {
				var updated_students = _.map(c.students, function(s) {
					if (s.id == student.id) {
						s.isSelected = flag;
					}
					return s;
				});
				c.students = updated_students;
			}
			return c;
		}, this);
		this.setState({classrooms: updated});
	},

	updateUnitName: function(unitName) {
		this.isUnitNameValid();
		this.props.actions.update({name: unitName})
	},

	clickContinue: function() {
		this.props.analytics.track('click Continue in lesson planner');
		this.props.actions.toggleStage(2);
		this.resetWindowPosition();
	},

	resetWindowPosition: function() {
		window.scrollTo(500, 0);
	},

	finish: function() {
		$.ajax({
			type: 'POST',
			url: '/teachers/units',
			data: JSON.stringify(this.formatCreateRequestData()),
			dataType: 'json',
			contentType: 'application/json',
			success: (response) => this.onCreateSuccess(response)
		});
	},

	formatCreateRequestData: function() {
		var classroomPostData = _.select(this.getClassrooms(), function(c) {
			var includeClassroom,
				selectedStudents;
			if (this.emptyClassroomSelected(c)) {
				includeClassroom = true;
			} else {
				selectedStudents = _.where(c.students, {isSelected: true});
				includeClassroom = selectedStudents.length > 0;
			}
			return includeClassroom;
		}, this);

		classroomPostData = _.map(classroomPostData, function(c) {
			var selectedStudentIds;
			var selectedStudents = _.where(c.students, {isSelected: true});
			if (selectedStudents.length == c.students.length) {
				selectedStudentIds = [];
			} else {
				selectedStudentIds = _.map(selectedStudents, function(s) {
					return s.id
				});
			}
			return {id: c.classroom.id, student_ids: selectedStudentIds};
		});

		var sas = this.getSelectedActivities()

		var activityPostData = _.map(sas, function(sa) {
			return {
				id: sa.id,
				due_date: this.dueDate(sa.id)
			}
		}, this)

		var x = {
			unit: {
				id: this.getId(),
				name: this.getUnitName(),
				classrooms: classroomPostData,
				activities: activityPostData
			}
		};
		return x;
	},

	onCreateSuccess: function(response) {
		this.setState({newUnitId: response.id})
		this.props.actions.toggleStage(3);
	},

	isUnitNameValid: function() {
		return ((this.getUnitName() != null) && (this.getUnitName() != ''));
	},

	determineIfInputProvidedAndValid: function() {
		const validUnitName = this.isUnitNameValid();
		let isUnique;
		if (validUnitName) {
			isUnique = this.isUnitNameUnique();
		}
		const activitiesSelected = (this.getSelectedActivities().length > 0);
		return (isUnique && validUnitName && activitiesSelected);
	},

	emptyClassroomSelected: function(c) {
		var val = (c.emptyClassroomSelected === true);
		return val;
	},

	toggleEmptyClassroomSelected: function(c) {
		return !(this.emptyClassroomSelected(c));
	},

	areAnyStudentsSelected: function() {
		var x = _.select(this.getClassrooms(), function(c) {
			var includeClassroom;
			if (this.emptyClassroomSelected(c)) {
				includeClassroom = true;
			} else {
				var y = _.where(c.students, {isSelected: true});
				includeClassroom = y.length > 0;
			}
			return includeClassroom;
		}, this);

		return (x.length > 0);
	},

	determineStage1ErrorMessage: function() {
		let a = this.isUnitNameValid();
		let b = (this.getSelectedActivities().length > 0);
		let uniqueUnitNameError = !this.isUnitNameUnique();
		let msg;
		if (!a) {
			if (!b) {
				msg = 'Please provide a name and select activities for your activity pack.';
			} else {
				msg = 'Please provide a name for your activity pack.';
			}
		} else if (!b) {
			msg = 'Please select activities';
		} else if (uniqueUnitNameError) {
			msg = 'Please select a unique name for your activity pack.'
		} else {
			msg = null;
		}
		return msg;
	},

	determineStage2ErrorMessage: function() {
		var a = this.areAnyStudentsSelected();
		var msg;
		if (!a) {
			msg = 'Please select students';
		} else {
			msg = null;
		}
		return msg;
	},

	dueDate: function(id) {
		if (this.props.data.createUnitData.model.dueDates && this.props.data.createUnitData.model.dueDates[id]) {
			return this.props.data.createUnitData.model.dueDates[id];
		}
	},

	stage1SpecificComponents: function() {
		return (<UnitStage1
												toggleActivitySelection={this.props.actions.toggleActivitySelection}
												unitName={this.getUnitName()} updateUnitName={this.updateUnitName}
												selectedActivities={this.getSelectedActivities()}
												determineIfInputProvidedAndValid={this.determineIfInputProvidedAndValid}
												errorMessage={this.determineStage1ErrorMessage()}
												clickContinue={this.clickContinue}/>);
	},

	stage2SpecificComponents: function () {
			return (<Stage2 selectedActivities={this.getSelectedActivities()}
								 data={this.props.data.assignSuccessData}
								 dueDates={this.props.data.createUnitData.model.dueDates}
								 actions={this.props.actions.assignSuccessActions}
								 classrooms={this.getClassrooms()}
								 toggleActivitySelection={this.props.actions.toggleActivitySelection}
								 toggleClassroomSelection={this.toggleClassroomSelection}
								 toggleStudentSelection={this.toggleStudentSelection}
								 finish={this.finish}
								 unitName={this.getUnitName()}
								 assignActivityDueDate={this.props.actions.assignActivityDueDate}
								 areAnyStudentsSelected={this.areAnyStudentsSelected()}
								 errorMessage={this.determineStage2ErrorMessage()}/>);
	},

	stage3specificComponents: function() {
		if ((!!this.props.actions.assignSuccessActions) && (!!this.props.data.assignSuccessData)) {
			return (<UnitTemplatesAssigned actions={this.props.actions.assignSuccessActions} data={this.props.data.assignSuccessData}/>);
		} else {
			window.location.href = `/teachers/classrooms/activity_planner#${this.state.newUnitId}`;
		}
	},

	render: function() {
		var stageSpecificComponents;

		if (this.getStage() === 1) {
			stageSpecificComponents = this.stage1SpecificComponents();
		} else if (this.getStage() === 2) {
			stageSpecificComponents = this.stage2SpecificComponents();
		} else if (this.getStage() === 3) {
			stageSpecificComponents = this.stage3specificComponents();
		}
		return (
			<span>
				<ProgressBar stage={this.getStage()}/>
				<div className='container'>
					{stageSpecificComponents}
				</div>
			</span>

		);
	}
});
