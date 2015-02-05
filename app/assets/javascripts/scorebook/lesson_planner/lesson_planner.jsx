
$(function () {
	ele = $('#lesson_planner');
	if (ele.length > 0) {
		React.render(React.createElement(EC.LessonPlanner), ele[0]);
	}
	
});



EC.LessonPlanner = React.createClass({

	getInitialState: function () {
		return {
			unitName: null,
			stage: 1, // stage 1 is selecting activities, stage 2 is selecting students and dates
			selectedActivities : [],			
			selectedClassrooms: [],
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
		var classrooms = this.state.selectedClassrooms;
		classroom.all_students = flag; // Toggle all_students flag
		if (flag) {
			classrooms.push(classroom);
		} else {
			classrooms = _.reject(classrooms, classroom);
		}
		this.setState({selectedClassrooms: classrooms});
	},

	toggleStudentSelection: function(student, classroom, flag) {
		// Need to find the classroom in the list of selected classrooms
		// and append/remove student ID.
		// If the classroom is not there, add it and append student ID.
		var classrooms = this.state.selectedClassrooms;

		if (!classroom.students) {
			classroom.students = [];
		}

		if (flag) {
			// Add student
			if (!_.contains(classrooms, classroom)) {
				classroom.all_students = false;
				classrooms.push(classroom);
			};
			classroom.students.push(student);
		} else {
			// Remove student
			classroom.students = _.reject(classroom.students, student);
		}
		this.setState({selectedClassrooms: classrooms});
	},

	updateUnitName: function (unitName) {
		this.setState({unitName: unitName});
	},

	clickContinue: function () {
		this.setState({stage: 2});
	},

	// Save everything and then... follow a redirect?
	finish: function() {
		$.ajax({
			type: 'POST',
			url: '/teachers/units',
			data: this.formatCreateRequestData(),
			success: this.onCreateSuccess,
		});
		console.log('final state', this.state);
	},

	formatCreateRequestData: function() {
		// Merge selectedStudents and selectedClassrooms together so that
		// it will match the server request format.

		// When the entire classroom is selected, send all_students = true flag.
		var classroomPostData = this.state.selectedClassrooms.map(function(classroom) {
			return {
				id: classroom.id,
				all_students: !!classroom.all_students,
				student_ids: _.pluck(classroom.students, 'id')
			}
		}, this);

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
		return x
		
	},

	onCreateSuccess: function(response) {
		console.log('response', response);
		window.location.assign(response.classroom_id + '/scorebook')
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
																					 toggleActivitySelection={this.toggleActivitySelection}	
																					 toggleClassroomSelection={this.toggleClassroomSelection} 
																					 toggleStudentSelection={this.toggleStudentSelection}
																					 finish={this.finish} 
																					 unitName={this.state.unitName}
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







