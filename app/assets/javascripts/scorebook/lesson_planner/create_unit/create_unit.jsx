"use strict";
EC.CreateUnit = React.createClass({

	getInitialState: function () {
		return {
			unitName: null,
			stage: 1, // stage 1 is selecting activities, stage 2 is selecting students and dates
			selectedActivities : [],
			selectedClassrooms: [],
			classrooms: [],
			dueDates: {}
		}
	},

	assignActivityDueDate: function(activity, dueDate) {
		var dueDates = this.state.dueDates;
		dueDates[activity.id] = dueDate;
		this.setState({dueDates: dueDates});
	},

	toggleActivitySelection: function (true_or_false, activity) {
		var selectedActivities = this.state.selectedActivities;
		if (true_or_false) {
			selectedActivities.push(activity);
		} else {
			selectedActivities = _.reject(selectedActivities, activity);
		}
		this.setState({selectedActivities: selectedActivities});
	},

	toggleClassroomSelection: function(classroom, flag) {
		var classrooms = this.state.classrooms;
		var updated = _.map(classrooms, function (c) {
			if (c.classroom.id == classroom.id) {
				if (c.students) {
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
		});
		this.setState({classrooms: updated});
	},

	toggleStudentSelection: function(student, classroom, flag) {
		var updated = _.map(this.state.classrooms, function (c) {
			if (c.classroom.id == classroom.id) {
				if (c.students) {
					var updated_students = _.map(c.students, function (s) {
						if (s.id == student.id) {
							s.isSelected = flag;
						}
						return s;
					});
					c.students = updated_students;
				}
			}
			return c;
		});
		this.setState({classrooms: updated});
	},

	updateUnitName: function (unitName) {
		this.setState({unitName: unitName});
	},

	clickContinue: function () {
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
			var selectedStudents;
			if (!c.students) {
				selectedStudents = [];
			} else {
				selectedStudents = _.where(c.students, {isSelected: true});
			}
			return (selectedStudents.length > 0);
		});

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

	determineAssignButtonClass: function () {
		var classroomsSelected = _.select(this.state.classrooms, function (c) {
			if (c.students) {
				var c1 = _.where(c.students, {isSelected: true});
				return (c1.length > 0);
			} else {
				return false;
			}
		});
		var a = (classroomsSelected.length > 0);
		var b = (this.state.selectedActivities.length == Object.keys(this.state.dueDates).length);
		var c = (this.state.selectedActivities.length > 0);
		if (a && b && c) {
			return 'button-green';
		} else {
			return 'hidden-button';
		}

	},

	render: function () {
		var stageSpecificComponents;

		if (this.state.stage === 1) {
			stageSpecificComponents = <EC.Stage1 toggleActivitySelection={this.toggleActivitySelection}
								 unitName = {this.state.unitName}
								 updateUnitName={this.updateUnitName}
								 selectedActivities={this.state.selectedActivities}
								 clickContinue={this.clickContinue} />;
		} else {
			stageSpecificComponents = <EC.Stage2 selectedActivities={this.state.selectedActivities}
																					 classrooms={this.state.classrooms}
																					 toggleActivitySelection={this.toggleActivitySelection}
																					 toggleClassroomSelection={this.toggleClassroomSelection}
																					 toggleStudentSelection={this.toggleStudentSelection}
																					 finish={this.finish}
																					 unitName={this.state.unitName}
																					 determineAssignButtonClass={this.determineAssignButtonClass}
																					 assignActivityDueDate={this.assignActivityDueDate} />;
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