"use strict";
$(function () {
	var ele = $('#dashboard');
  console.log(ele)
	if (ele.length > 0) {
		React.render(React.createElement(EC.Dashboard), ele[0]);
	}
});


  EC.Dashboard = React.createClass({
  	getInitialState: function () {
			return (
			{
				classrooms: null
			}
		);
  	},

  	componentWillMount: function () {
			this.serverRequest = $.get('classroom_mini', function (result) {
					this.setState({
						classrooms: result.classes
					});
				}.bind(this));
  	},

	componentWillUnmount: function() {
			this.serverRequest.abort();
	 },

	 stateSpecificComponents: function(){
		 if (this.state.classrooms === null)
		 	return ('no classrooms');
		 else {
			return (
				<EC.MyClasses classList={this.state.classrooms}/>
			);
		 }
	 },

  	render: function() {

  		return (
				<div>
						{this.stateSpecificComponents()}
				</div>
  		);
  	}
  });
