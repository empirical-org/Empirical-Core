$(function () {
	ele = $('#scorebook');
	if (ele.length > 0) {
		React.render(React.createElement(EC.Scorebook), ele[0]);
	}
});

EC.Scorebook = React.createClass({
	mixins: [EC.TableFilterMixin],

	getInitialState: function () {
		return {
			units: [],
			classrooms: [],
			defaultUnit: 'All Units',
			defaultClassroom: 'All Classrooms'
		}
	},

	componentDidMount: function () {
		that = this		
		$.ajax({
			url: 'scores',
			data: {},
			success: function (data) {
				console.log('display scores', data);
				that.setState({
					units: data.units,
					classroom: data.classroom,
					classrooms: data.classrooms,
					classroomFilters: that.getFilterOptions(data.classrooms, 'name', 'id', 'All Classrooms'),
					unitFilters: that.getFilterOptions(data.units, 'name', 'id', 'All Units')
				});

				if (data.unit) {
					that.setState({defaultUnit: data.unit.name})
				}
				if (data.classroom) {
					that.setState({defaultClassroom: data.classroom.name})
				}

			},
			error: function () {

			}
		})
	},
	displayScores: function (data) {
		
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
		            	defaultClassroom = {this.state.defaultClassroom}
		            	classroomFilters = {this.state.classroomFilters}
		            	selectClassroom={this.selectClassroom}

		            	defaultUnit= {this.state.defaultUnit}
		            	unitFilters = {this.state.unitFilters}
		            	selectUnit={this.selectUnit} />

		            <EC.ScorebookLegend />
		        </div>

			</span>
		);
	}


});