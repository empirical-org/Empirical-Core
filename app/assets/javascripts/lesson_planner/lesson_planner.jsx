'use strict';
$(function () {
	var ele = $('#activity-planner');
	if (ele.length > 0) {
		var props = {
			analytics: new EC.AnalyticsWrapper()
		};
		React.render(React.createElement(EC.LessonPlanner, props), ele[0]);
	}

});



EC.LessonPlanner = React.createClass({
	propTypes: {
		analytics: React.PropTypes.object.isRequired
	},

	getInitialState: function () {
		return {
			//tab: 'manageUnits',
			tab: 'exploreActivityPacks',
			createUnit: {
				stage: 1,
				toggleActivitySelection: this.toggleActivitySelection,
				update: this.updateCreateUnitModel,
				options: {
					classrooms: []
				},
				model: {
					name: null,
					selectedActivities: []
				}
			}
		}
	},

	updateCreateUnit: function (hash) {
		this.setState(this.modules.LessonPlannerState.updateCreateUnit(this.state, hash), this.forceUpdate);
	},

	updateCreateUnitModel: function (hash) {
		var newState = this.modules.LessonPlannerState.updateCreateUnitModel(this.state, hash)
		console.log('newState', newState)
		this.setState(newState, this.forceUpdate);
	},

	componentDidMount: function () {
		this.modules = {
			fnl: new EC.modules.fnl(),
			LessonPlannerState: new EC.modules.LessonPlannerState()
		};
	},

	toggleTab: function (tab) {
		if (tab == 'createUnit') {
			this.props.analytics.track('click Create Unit', {});
		}
		this.setState({tab: tab});
	},

	toggleStage: function (stage) {
		var newState = this.state;
		newState.createUnit.stage = 2;
		this.fetchClassrooms();
		this.setState(newState);
	},

  fetchClassrooms: function() {
    var that = this;
    $.ajax({
      url: '/teachers/classrooms/retrieve_classrooms_for_assigning_activities',
      context: this,
      success: function (data) {
        that.updateCreateUnit({options: {classrooms: data.classrooms_and_their_students}})
      },
      error: function () {
        console.log('error fetching classrooms');
      }
    });
  },

  getSelectedActivities: function () {
  	return this.state.createUnit.model.selectedActivities;
  },

  toggleActivitySelection: function (activity, true_or_false) {
		if (true_or_false) {
			this.props.analytics.track('select activity in lesson planner', {name: activity.name, id: activity.id});
		}
		var sas = this.modules.fnl.toggle(this.getSelectedActivities(), activity);
		this.updateCreateUnitModel({selectedActivities: sas});
	},

	loadActivityPackIntoUnitCreator: function (unitTemplate) {
		this.updateCreateUnit({stage: 2})
		this.updateCreateUnitModel({
			name: unitTemplate.name,
			selectedActivities: unitTemplate.activities
		})
		this.toggleTab('createUnit')
		this.fetchClassrooms()
	},

	render: function () {
		var tabSpecificComponents;
		if (this.state.tab == 'createUnit') {
			tabSpecificComponents = <EC.CreateUnit toggleTab={this.toggleTab}
																						 toggleStage={this.toggleStage}
																						 data={this.state.createUnit}
																						 analytics={this.props.analytics}/>;
		} else if (this.state.tab == 'manageUnits') {
			tabSpecificComponents = <EC.ManageUnits toggleTab={this.toggleTab} />;
		} else if (this.state.tab == 'exploreActivityPacks') {
			tabSpecificComponents = <EC.UnitTemplatesManager
																		loadActivityPackIntoUnitCreator={this.loadActivityPackIntoUnitCreator} />;
		}

		return (
			<span>
				<EC.UnitTabs tab={this.state.tab} toggleTab={this.toggleTab}/>
				<div id="lesson_planner" >
					{tabSpecificComponents}
				</div>
			</span>
		);

	}
});






