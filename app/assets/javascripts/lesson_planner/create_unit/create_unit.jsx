"use strict";
EC.CreateUnit = React.createClass({
	propTypes: {
		analytics: React.PropTypes.object.isRequired
	},

	getInitialState: function () {
		return {
			unitName: null,
			stage: 1, // stage 1 is selecting activities, stage 2 is selecting students and dates
			selectedActivities : [],
			selectedClassrooms: [],
			classrooms: [],
			dueDates: {},
			fnl: new EC.fnl()
		}
	},

	assignActivityDueDate: function(activity, dueDate) {
		var dueDates = this.state.dueDates;
		dueDates[activity.id] = dueDate;
		this.setState({dueDates: dueDates});
	},

	toggleActivitySelection: function (true_or_false, activity) {
		if (true_or_false) {
			this.props.analytics.track('select activity in lesson planner', {name: activity.name, id: activity.id});
		}
		var sas = this.state.fnl.toggle(this.state.selectedActivities, activity, true_or_false);
		this.setState({selectedActivities: sas});
	},

	toggleClassroomSelection: function(classroom, flag) {
		var classrooms = this.state.classrooms;
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
		var updated = _.map(this.state.classrooms, function (c) {
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
		this.setState({unitName: unitName});
	},

	clickContinue: function () {
		this.props.analytics.track('click Continue in lesson planner');
		this.fetchClassrooms();
		this.setState({stage: 2});
	},

	fetchClassrooms: function() {
    var that = this;
    $.ajax({
      url: '/teachers/classrooms/retrieve_classrooms_for_assigning_activities',
      context: this,
      success: function (data) {
        that.setState({classrooms: data.classrooms_and_their_students});
      },
      error: function () {
        console.log('error fetching classrooms');
      }
    });
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
		var classroomPostData = _.select(this.state.classrooms, function (c) {
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
				name: this.state.unitName,
				classrooms: classroomPostData,
				activities: activityPostData
			}
		};
		return x;
	},

	onCreateSuccess: function(response) {
		this.props.toggleTab('manageUnits');
	},

	isUnitNameSelected: function () {
		return ((this.state.unitName != null) && (this.state.unitName != ''));
	},

	determineIfEnoughInputProvidedToContinue: function () {
		var a = this.isUnitNameSelected();
		var b = (this.state.selectedActivities.length > 0);
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
		var x = _.select(this.state.classrooms, function (c) {
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
		return (Object.keys(this.state.dueDates).length == this.state.selectedActivities.length);
	},

	determineStage1ErrorMessage: function () {
		var a = this.isUnitNameSelected();
		var b = (this.state.selectedActivities.length > 0);
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
		return (<EC.UnitStage1 toggleActivitySelection={this.toggleActivitySelection}
								 unitName = {this.state.unitName}
								 updateUnitName={this.updateUnitName}
								 selectedActivities={this.state.selectedActivities}
								 isEnoughInputProvidedToContinue={this.determineIfEnoughInputProvidedToContinue()}
								 errorMessage={this.determineStage1ErrorMessage()}
								 clickContinue={this.clickContinue} />);
	},

	stage2SpecificComponents: function () {
			return (<EC.Stage2 selectedActivities={this.state.selectedActivities}
								 classrooms={this.state.classrooms}
								 toggleActivitySelection={this.toggleActivitySelection}
								 toggleClassroomSelection={this.toggleClassroomSelection}
								 toggleStudentSelection={this.toggleStudentSelection}
								 finish={this.finish}
								 unitName={this.state.unitName}
								 assignActivityDueDate={this.assignActivityDueDate}
								 areAnyStudentsSelected={this.areAnyStudentsSelected()}
								 areAllDueDatesProvided={this.areAllDueDatesProvided()}
								 errorMessage={this.determineStage2ErrorMessage()}/>);
	},

	render: function () {
		var stageSpecificComponents;

		if (this.state.stage === 1) {
			stageSpecificComponents = this.stage1SpecificComponents();
		} else {
			stageSpecificComponents = this.stage2SpecificComponents();
		}
		return (
			<span>
				<EC.ProgressBar stage={this.state.stage}/>
				<div className='container lesson_planner_main'>
					{stageSpecificComponents}
				</div>
			</span>

		);
	}
});