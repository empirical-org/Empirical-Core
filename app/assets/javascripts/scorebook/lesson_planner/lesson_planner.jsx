
$(function () {
	ele = $('#activity-planner');
	if (ele.length > 0) {
		React.render(React.createElement(EC.LessonPlanner), ele[0]);
	}
	
});



EC.LessonPlanner = React.createClass({

	getInitialState: function () {
		return {
			tab: 'createUnit',
		}
	},
	toggleTab: function (tab) {
		this.setState({tab: tab})
	},

	render: function () {
		var tabSpecificComponents;
		if (this.state.tab == 'createUnit') {
			tabSpecificComponents = <EC.CreateUnit />
		} else {
			tabSpecificComponents = <EC.ManageUnits />
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






