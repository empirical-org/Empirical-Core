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
			defaultUnit: {name: 'All Units', value: ''},
			defaultClassroom: {name: 'All Classrooms', value: ''},
			selectedClassroom: null,
			selectedUnit: null,
			currentPage: 1,
			loading: true
		}
	},
	scrollComputation: function () {
		var y = $('#page-content-wrapper').height()
		var w = 1/(this.state.currentPage + 1)
		var z = y*(1 - w)
		return z
	},	

	componentDidMount: function () {
		this.fetchData();
		var that = this;
		$(window).scroll(function (e) {
			if (($(window).scrollTop() + document.body.clientHeight) > (that.scrollComputation() )) {
				if (!that.state.loading) {
					that.loadMore();
				}
			}
		});
	},
	loadMore: function () {
		this.setState({loading: true, currentPage: this.state.currentPage + 1})
		this.fetchData();
	},
	fetchData: function () { 
		$.ajax({
			url: 'scores',
			data: {
				current_page: this.state.currentPage,
				classroom_id: this.state.selectedClassroom,
				unit_id: this.state.selectedUnit
			},
			success: this.displayData
		})
	},

	displayData: function (data) {
		this.setState({
			classroomFilters: this.getFilterOptions(data.classrooms, 'name', 'id', 'All Classrooms'),
			unitFilters: this.getFilterOptions(data.units, 'name', 'id', 'All Units'),
		});
		if (this.state.currentPage == 1) {
			this.setState({scores: data.scores});
		} else {
			var x1 = _.last(_.keys(this.state.scores))			
			var new_scores = this.state.scores
			_.forEach(data.scores, function (val, key) {
				if (key == x1) {
					new_scores[key]['results'] = (new_scores[key]['results']).concat(val['results'])
				} else {
					new_scores[key] = val
				}
			})
			this.setState({scores: new_scores})
		}
		this.setState({loading: false})
	},

	selectUnit: function (id) {
		this.setState({currentPage: 1, selectedUnit: id})
		this.fetchData();

	},

	selectClassroom: function (id) {
		this.setState({currentPage: 1, selectedClassroom: id})
		this.fetchData();
	},

	render: function() {
		scores = _.map(this.state.scores, function (data, student_id) {
			return <EC.StudentScores data={data} />
		});
		if (this.state.loading) {
			loadingIndicator = <div className="spinner-container"><i className="fa fa-refresh fa-spin"></i></div>
		} else {
			loadingIndicator = null
		}
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
		            <section className="section-content-wrapper">
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

		        {loadingIndicator}

			</span>
		);
	}


});