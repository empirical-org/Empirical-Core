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
			defaultClassroom: 'All Classrooms',
			selectedClassroom: null,
			selectedUnit: null
		}
	},

	componentDidMount: function () {
		this.fetchData();
	},

	fetchData: function () { 
		that = this
		$.ajax({
			url: 'scores',
			data: {
				classroom_id: this.state.selectedClassroom,
				unit_id: this.state.selectedUnit
			},
			success: function (data) {
				console.log('display scores', data);
				that.setState({
					units: data.units,
					classrooms: data.classrooms,
					classroomFilters: that.getFilterOptions(data.classrooms, 'name', 'id', 'All Classrooms'),
					unitFilters: that.getFilterOptions(data.units, 'name', 'id', 'All Units'),
					scores: data.scores
				});
			},
			error: function () {

			}
		})
	},


	selectUnit: function () {
		console.log('select unit')
	},

	selectClassroom: function () {
		console.log('select classroom')
	},

	render: function() {
		scores = _.map(this.state.scores, function (data, student_id) {
			return <EC.StudentScores data={data} />
		});
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
		            <section>
				            <EC.ScorebookFilters
				            	defaultClassroom = {this.state.defaultClassroom}
				            	classroomFilters = {this.state.classroomFilters}
				            	selectClassroom={this.selectClassroom}

				            	defaultUnit= {this.state.defaultUnit}
				            	unitFilters = {this.state.unitFilters}
				            	selectUnit={this.selectUnit} />

				            <EC.ScorebookLegend />
			        </section>
		        </div>


		        {scores}

			</span>
		);
	}


});