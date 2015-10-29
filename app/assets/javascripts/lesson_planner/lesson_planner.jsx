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
			tab: 'manageUnits',
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
		var newState = this.state;
		var newCU = _.extend({}, this.state.createUnit, hash)
		newState.createUnit = newCU;
		this.setState(newState);
	},

	updateCreateUnitModel: function (hash) {
		var model = _.extend({}, this.state.createUnit.model, hash);
		var newState = this.state;
		newState.createUnit.model = model;
		this.setState(newState);
	},

	componentDidMount: function () {
		this.modules = {
			fnl: new EC.modules.fnl()
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
        var newState = that.state;
        newState.createUnit.classrooms = data.classrooms_and_their_students;
        that.setState(newState);
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
		this.toggleTab('createUnit')
		this.updateCreateUnit({stage: 2})
		var newState = this.state;
		newState.createUnit.stage = 2;
		newState.createUnit.model.name = unitTemplate.name;
		//newState.

		// this.updateCreateUnitModel({
		// 	name: unitTemplate.name,
		// 	selectedActivities: unitTemplate.activities
		// })
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






