"use strict";
$(function () {
	var ele = $('#dashboard');
  console.log(ele)
	if (ele.length > 0) {
		React.render(React.createElement(EC.Dashboard), ele[0]);
	}
});


  EC.Dashboard = React.createClass({
    //
  	// getInitialState: function () {
    //
  	// },
    //
  	// componentDidMount: function () {
  	// 	this.fetchData();
  	// },

  	fetchData: function () {
  		// $.ajax({
  		// 	url: 'scores',
  		// 	data: {
  		// 		current_page: newCurrentPage,
  		// 		classroom_id: this.state.selectedClassroom.value,
  		// 		unit_id: this.state.selectedUnit.value,
  		// 		begin_date: this.state.beginDate,
  		// 		end_date: this.state.endDate,
  		// 		no_load_has_ever_occurred_yet: this.state.noLoadHasEverOccurredYet
  		// 	},
  		// 	success: this.displayData
  		// });
  	},

  	displayData: function (data) {
  	},


  	render: function() {

  		return (
				<div>
						<EC.MyClasses/>
				</div>
  		);
  	}
  });
