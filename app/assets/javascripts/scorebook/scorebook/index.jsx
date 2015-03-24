"use strict";
$(function () {
	var ele = $('#scorebook');
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
			selectedUnit: {name: 'All Units', value: ''},
			selectedClassroom: {name: 'All Classrooms', value: ''},
			classroomFilters: [],
			unitFilters: [],
			beginDate: null,
			endDate: null,
			currentPage: 1,
			loading: false,
			isLastPage: false,
			noLoadHasEverOccurredYet: true
		}
	},

	scrollComputation: function () {
		var y = $('#page-content-wrapper').height();
		var w = 1/(this.state.currentPage + 1);
		var z = y*(1 - w);
		return z;
	},

	componentDidMount: function () {
		this.fetchData();
		var that = this;
		$(window).scroll(function (e) {
			if (($(window).scrollTop() + document.body.clientHeight) > (that.scrollComputation() )) {
				if (!that.state.loading && !that.state.isLastPage) {
					that.loadMore();
				}
			}
		});
	},

	loadMore: function () {
		this.setState({currentPage: this.state.currentPage + 1});
		this.fetchData();
	},

	fetchData: function () {
		this.setState({loading: true})
		$.ajax({
			url: 'scores',
			data: {
				current_page: this.state.currentPage,
				classroom_id: this.state.selectedClassroom.value,
				unit_id: this.state.selectedUnit.value,
				begin_date: this.state.beginDate,
				end_date: this.state.endDate,
				no_load_has_ever_occurred_yet: this.state.noLoadHasEverOccurredYet
			},
			success: this.displayData
		});
	},

	displayData: function (data) {
		if (data.was_classroom_selected_in_controller) {
			this.setState({selectedClassroom: data.selected_classroom});
		}
		this.setState({
			classroomFilters: this.getFilterOptions(data.classrooms, 'name', 'id', 'All Classrooms'),
			unitFilters: this.getFilterOptions(data.units, 'name', 'id', 'All Units'),
			isLastPage: data.is_last_page,
			noLoadHasEverOccurredYet: false
		});
		if (this.state.currentPage == 1) {
			this.setState({scores: data.scores});
		} else {
			var y1 = this.state.scores;
			var new_scores = [];
			_.forEach(data.scores, function (score) {
				var user_id = score.user.id;
				var y2 = _.find(y1, function (ele) {
					return ele.user.id == user_id;
				});
				if (y2 == undefined) {
					new_scores.push(score);
				} else {
					y1 = _.map(y1, function (ele) {
						if (ele == y2) {
							ele.results = ele.results.concat(score.results);
						}
						var w1 = ele;
						return w1;
					});
				}
			})
			var all_scores = y1.concat(new_scores)
			this.setState({scores: all_scores});
		}
		this.setState({loading: false});
	},

	selectUnit: function (option) {
		this.setState({currentPage: 1, selectedUnit: option}, this.fetchData);
	},

	selectClassroom: function (option) {
		this.setState({currentPage: 1, selectedClassroom: option}, this.fetchData);
	},
	selectDates: function (val1, val2) {
		this.setState({currentPage: 1, beginDate: val1, endDate: val2}, this.fetchData);
	},
	render: function() {
		var scores = _.map(this.state.scores, function (data) {
			return <EC.StudentScores key={data.user.id} data={data} />
		});
		if (this.state.loading) {
			var loadingIndicator = <EC.LoadingIndicator />;
		} else {
			var loadingIndicator = null;
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
				            	selectedClassroom = {this.state.selectedClassroom}
				            	classroomFilters = {this.state.classroomFilters}
				            	selectClassroom  = {this.selectClassroom}

				            	selectedUnit = {this.state.selectedUnit}
				            	unitFilters = {this.state.unitFilters}
				            	selectUnit  = {this.selectUnit}

				            	selectDates = {this.selectDates}/>
				            <EC.ScoreLegend />
				            <EC.AppLegend />
			        </section>
		        </div>
		        {scores}
		        {loadingIndicator}
			</span>
		);
	}
});