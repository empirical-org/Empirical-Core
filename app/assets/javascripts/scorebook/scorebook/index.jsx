$(function () {
	ele = $('#scorebook');
	if (ele.length > 0) {
		React.render(React.createElement(EC.Scorebook), ele[0]);
	}
});

EC.Scorebook = React.createClass({

	getInitialState: function () {
		return {
			scores: []
		}
	},

	componentDidMount: function () {
		$.ajax({
			url: 'scores',
			data: {},
			success: this.displayScores,
			error: function () {

			}
		})
	},
	displayScores: function (data) {
		console.log('display scores', data);
		this.setState({
			unit: data.unit,
			units: data.units,
			classroom: data.classroom,
			classrooms: data.classrooms
		});
	},

	render: function() {
		return (
			<span>

				<div className="tab-subnavigation-wrapper">
	                <div className="container">
	                  <ul>
	                    <li><a href="" className="active">Student View</a></li>
	                  </ul>
	                </div>
	            </div>

	            <EC.ClassroomSelectorAndLegend
	            	unit = {this.state.unit}
	            	units = {this.state.units}
	            	classroom = {this.state.classroom}
	            	classrooms = {this.state.classrooms} />
	            	 






			</span>
		);
	}


});