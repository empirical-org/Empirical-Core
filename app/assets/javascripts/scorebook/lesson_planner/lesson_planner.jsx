
$(function () {
	ele = $('#activity-planner');
	if (ele.length > 0) {
		React.render(React.createElement(EC.LessonPlanner), ele[0]);
	}
	
});



EC.LessonPlanner = React.createClass({

	getInitialState: function () {
		return {
			tab: 'CreateUnit',
		}
	},

	render: function () {
		var tabSpecificComponents;
		if (this.state.tab == 'CreateUnit') {
			tabSpecificComponents = <EC.CreateUnit />
		} else {
			tabSpecificComponents = <span>hii</span>
		}

		return (
			<span>

				<EC.UnitTabs />
				<div id="lesson_planner" >
					{tabSpecificComponents}
				</div>


			</span>
		);

	}
});






