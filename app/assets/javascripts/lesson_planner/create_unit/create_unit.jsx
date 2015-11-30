"use strict";
EC.CreateUnit = React.createClass({
	propTypes: {
		data: React.PropTypes.object.isRequired,
		// createUnit: {
		// 		stage: 1,
		// 		options: {
		// 			classrooms: []
		// 		},
		// 		model: {
		// 			name: null,
		// 			selectedActivities: []
		// 		}
		actions: React.PropTypes.object.isRequired,
		analytics: React.PropTypes.object.isRequired
	},

	getInitialState: function () {
		return {
			selectedActivities : [],
			selectedClassrooms: [],
			dueDates: {}
		}
	},

	getStage: function () {
		return this.props.data.stage;
	},

	getSelectedActivities: function () {
		return this.props.data.model.selectedActivities;
	},

	getClassrooms: function () {
		return this.props.data.options.classrooms;
	},

	getUnitName: function () {
		return this.props.data.model.name;
	},

	assignActivityDueDate: function(activity, dueDate) {
		console.log('assign acitivyt due date in EC.CreateUnit', {activity: activity, dueDate: dueDate})
		var dueDates = this.state.dueDates;
		dueDates[activity.id] = dueDate;
		this.setState({dueDates: dueDates});
	},

	toggleClassroomSelection: function(classroom, flag) {
		var classrooms = this.getClassrooms();
		var updated = _.map(classrooms, function (c) {
			if (c.classroom.id == classroom.id) {
				if (c.students.length == 0) {
					c.emptyClassroomSelected = (this.toggleEmptyClassroomSelected(c));
				} else {
					var selected = _.where(c.students, {isSelected: true});
					if (selected.length == c.students.length) {
						var updatedStudents = _.map(c.students, function (s) {
							s.isSelected = false;
							return s;
						});
					} else {
						var updatedStudents = _.map(c.students, function (s) {
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
		var updated = _.map(this.getClassrooms(), function (c) {
			if (c.classroom.id == classroom.id) {
				var updated_students = _.map(c.students, function (s) {
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

	updateUnitName: function (unitName) {
		this.props.actions.update({name: unitName})
	},

	clickContinue: function () {
		this.props.analytics.track('click Continue in lesson planner');
		this.props.actions.toggleStage(2);
		this.resetWindowPosition();
	},

	resetWindowPosition: function () {
		window.scrollTo(500, 0);
	},

	finish: function() {
		$.ajax({
			type: 'POST',
			url: '/teachers/units',
			data: this.formatCreateRequestData(),
			success: this.onCreateSuccess,
		});
	},

	formatCreateRequestData: function() {
		var classroomPostData = _.select(this.getClassrooms(), function (c) {
			var includeClassroom, selectedStudents;
			if (this.emptyClassroomSelected(c)) {
				includeClassroom = true;
			} else {
				selectedStudents = _.where(c.students, {isSelected: true});
				includeClassroom = selectedStudents.length > 0;
			}
			return includeClassroom;
		}, this);

		classroomPostData = _.map(classroomPostData, function (c) {
			var selectedStudentIds;
			var selectedStudents = _.where(c.students, {isSelected: true});
			if (selectedStudents.length == c.students.length) {
				selectedStudentIds = [];
			} else {
				selectedStudentIds = _.map(selectedStudents, function (s) {return s.id});
			}
			return {id: c.classroom.id, student_ids: selectedStudentIds};
		});

		var activityPostData = _.map(this.state.dueDates, function(key, value) {
			return {
				id: value,
				due_date: key
			}
		});
		var x = {
			unit: {
				name: this.getUnitName(),
				classrooms: classroomPostData,
				activities: activityPostData
			}
		};
		return x;
	},

	onCreateSuccess: function(response) {
		this.props.actions.toggleTab('manageUnits');
	},

	isUnitNameSelected: function () {
		return ((this.getUnitName() != null) && (this.getUnitName() != ''));
	},

	determineIfEnoughInputProvidedToContinue: function () {
		var a = this.isUnitNameSelected();
		var b = (this.getSelectedActivities().length > 0);
		return (a && b);
	},

	emptyClassroomSelected: function (c) {
		var val = (c.emptyClassroomSelected === true);
		return val;
	},

	toggleEmptyClassroomSelected: function (c) {
		return !(this.emptyClassroomSelected(c));
	},

	areAnyStudentsSelected: function () {
		var x = _.select(this.getClassrooms(), function (c) {
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

	areAllDueDatesProvided: function () {
		return (Object.keys(this.state.dueDates).length == this.getSelectedActivities().length);
	},

	determineStage1ErrorMessage: function () {
		var a = this.isUnitNameSelected();
		var b = (this.getSelectedActivities().length > 0);
		var msg;
		if (!a) {
			if (!b) {
				msg = "Please provide a unit name and select activities";
			} else {
				msg = "Please provide a unit name";
			}
		} else if (!b) {
			msg = "Please select activities";
		} else {
			msg = null;
		}
		return msg;
	},

	determineStage2ErrorMessage: function () {
		var a = this.areAnyStudentsSelected();
		var b = this.areAllDueDatesProvided();
		var msg;
		if (!a) {
			if (!b) {
				msg = "Please select students and due dates";
			} else {
				msg = "Please select students";
			}
		} else if (!b) {
			msg = "Please select due dates";
		} else {
			msg = null;
		}
		return msg;
	},

	stage1SpecificComponents: function () {
		return (<EC.UnitStage1 toggleActivitySelection={this.props.actions.toggleActivitySelection}
								 unitName = {this.getUnitName()}
								 updateUnitName={this.updateUnitName}
								 selectedActivities={this.getSelectedActivities()}
								 isEnoughInputProvidedToContinue={this.determineIfEnoughInputProvidedToContinue()}
								 errorMessage={this.determineStage1ErrorMessage()}
								 clickContinue={this.clickContinue} />);
	},

	stage2SpecificComponents: function () {
			console.log(this.getClassrooms())
			return (<EC.Stage2 selectedActivities={this.getSelectedActivities()}
								 classrooms={this.getClassrooms()}
								 toggleActivitySelection={this.toggleActivitySelection}
								 toggleClassroomSelection={this.toggleClassroomSelection}
								 toggleStudentSelection={this.toggleStudentSelection}
								 finish={this.finish}
								 unitName={this.getUnitName()}
								 assignActivityDueDate={this.assignActivityDueDate}
								 areAnyStudentsSelected={this.areAnyStudentsSelected()}
								 areAllDueDatesProvided={this.areAllDueDatesProvided()}
								 errorMessage={this.determineStage2ErrorMessage()}/>);
	},

	render: function () {
		var stageSpecificComponents;

		if (this.getStage() === 1) {
			stageSpecificComponents = this.stage1SpecificComponents();
		} else {
			stageSpecificComponents = this.stage2SpecificComponents();
		}
		return (
			<span>
				<EC.ProgressBar stage={this.getStage}/>
				<div className='container lesson_planner_main'>
					{stageSpecificComponents}
				</div>
			</span>

		);
	}
});