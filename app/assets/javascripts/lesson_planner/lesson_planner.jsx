$(function () {
	ele = $('#activity-planner');
	if (ele.length > 0) {
		var props = {
			analytics: new AnalyticsWrapper()
		};
		React.render(React.createElement(EC.LessonPlanner, props), ele[0]);
	}

});



EC.LessonPlanner = React.createClass({

	getInitialState: function () {
		return {
			tab: 'manageUnits',
		}
	},
	toggleTab: function (tab) {
		if (tab == 'createUnit') {
			this.props.analytics.track('click Create Unit', {});
		}
		this.setState({tab: tab});

	},

	render: function () {
		var tabSpecificComponents;
		if (this.state.tab == 'createUnit') {
			tabSpecificComponents = <EC.CreateUnit toggleTab={this.toggleTab} analytics={this.props.analytics}/>;
		} else {
			tabSpecificComponents = <EC.ManageUnits toggleTab={this.toggleTab} />;
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






