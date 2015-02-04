
$(function () {
	ele = $('#lesson_planner');
	if (ele.length > 0) {
		React.render(React.createElement(EC.LessonPlanner), ele[0]);
	}
	
});



EC.LessonPlanner = React.createClass({

	getInitialState: function () {
		return {
			unitName: '',
			stage: 1, // stage 1 is selecting activities, stage 2 is selecting students and dates
			selectedActivities : [],			
			selectedClassrooms: [],			
		}
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

	updateUnitName: function (unitName) {
		this.setState({unitName: unitName});
	},

	clickContinue: function () {
		this.setState({stage: 2});
	},

	render: function () {
		var stageSpecificComponents;

		if (this.state.stage === 1) {
			stageSpecificComponents = <EC.Stage1 toggleActivitySelection={this.toggleActivitySelection} 
								 updateUnitName={this.updateUnitName}
								 selectedActivities={this.state.selectedActivities} 
								 clickContinue={this.clickContinue} />;
		} else {
			stageSpecificComponents = <EC.Stage2 />;
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







