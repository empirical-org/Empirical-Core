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
			classrooms: data.classrooms,

			classroomFilters: this.getFilterOptions(data.classrooms, 'name', 'id', 'All Classrooms'),
			unitFilters: this.getFilterOptions(data.units, 'name', 'id', 'All Units')


			   

		});
	},

	selectUnit: function () {
		console.log('select unit')
	},

	selectClassroom: function () {
		console.log('select classroom')
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
	            <div className="container">
		            <EC.ScorebookFilters
		            	defaultClassroom = {this.state.classroom.name}
		            	classroomFilters = {this.state.classroomFilters}
		            	selectClassroom={this.selectClassroom}

		            	defaultUnit={this.state.unit.name}
		            	unitFilters = {this.state.unitFilters}
		            	selectUnit={this.selectUnit}/>
		        </div>

			</span>
		);
	}


});