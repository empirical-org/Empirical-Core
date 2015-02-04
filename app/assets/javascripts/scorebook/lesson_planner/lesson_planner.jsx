
$(function () {
	ele = $('#lesson_planner');
	if (ele.length > 0) {
		React.render(React.createElement(EC.LessonPlanner), ele[0]);
	}
	
});



EC.LessonPlanner = React.createClass({

	getInitialState: function () {
		return {
			unitName: '',
			stage: 1, // stage 1 is selecting activities, stage 2 is selecting students and dates
			activitySearchResults: [],
			currentPageSearchResults: [],
			selectedActivities : [],
			
			classroomsAndTheirStudents: [],
			selectedClassrooms: [],


			currentPage: 1,
			numberOfPages: 1,
			resultsPerPage: 12,
			maxPageNumber: 4,
			query: '',
			filters: [
				{
					field: 'activityClassification',
					alias: 'App',
					options: [],
					selected: null
				},

				{
					field: 'section',
					alias: 'Standard Level',
					options: [],
					selected: null

				},
				{
					field: 'topic',
					alias: 'Concept',
					options: [],
					selected: null
				}
			],

			sorts: [
				{
					field: 'activityClassification',
					alias: 'App',
					selected: false,
					asc_or_desc: 'desc'
				},
				{
					field: 'activity',
					alias: 'Activity',
					selected: false,
					asc_or_desc: 'desc'
				},
				{
					field: 'section',
					alias: 'Standard Level',
					selected: false,
					asc_or_desc: 'desc'
				},
				{
					field: 'topic',
					alias: 'Concept',
					selected: false,
					asc_or_desc: 'desc'
				}
			]
			
		}
	},

	searchRequest: function () {
		$.ajax({
			url: '/teachers/classrooms/search_activities',
			context: this,
			data: this.searchRequestData(),
			success: this.searchRequestSuccess,
			error: function () {
				//console.log('error searching activities');
			}
		});
	},

	searchRequestData: function() {
		var filters = this.state.filters.map(function(filter) {
			return {
				field: filter['field'],
				selected: filter['selected']
			}
		});

		var currentSort;
		_.each(this.state.sorts, function(sort) {
			if (sort.selected) {
				currentSort = {
					field: sort['field'],
					asc_or_desc: sort['asc_or_desc']
				};
			}
		});

		return {
				search: {
					search_query: this.state.query,
					filters: filters,
					sort: currentSort,
				}
			}
	},

	searchRequestSuccess: function (data) {
		var filters = _.map(this.state.filters, function (filter) {
			key = filter.field + 's';
			filter.options = data[key];
			return filter;
		}, this);


		var hash = {
			activitySearchResults: data.activities,
			filters: filters,
			numberOfPages: data.number_of_pages,
		}

		this.setState(hash);

	},

	componentDidMount: function () {
		this.searchRequest();
	},
	toggleActivitySelection: function (true_or_false, activity) {
		var selectedActivities = this.state.selectedActivities;
		if (true_or_false) {
			selectedActivities.push(activity);
		} else {
			selectedActivities = _.reject(selectedActivities, activity);
		}
		this.setState({selectedActivities: selectedActivities});
	},

	updateUnitName: function (unitName) {
		this.setState({unitName: unitName});
	},
	updateSearchQuery: function (newQuery) {
		this.setState({query: newQuery})
		this.searchRequest();

	},
	selectFilterOption: function (field, optionId) {
		var filters = _.map(this.state.filters, function (filter) {
			if (filter.field == field) {
				filter.selected = optionId;
			}
			return filter;
		}, this);
		this.setState({filters: filters});
		this.searchRequest();

	},
	updateSort: function (field, asc_or_desc) {
		var sorts = _.map(this.state.sorts, function (sort) {
			if (sort.field == field) {
				sort.selected = true;
				sort.asc_or_desc = asc_or_desc;
			} else {
				sort.selected = false;
				sort.asc_or_desc = 'desc'
			}
			return sort;
		}, this);
		this.setState({sorts: sorts});
		this.searchRequest();
	},
	selectPageNumber: function (number) {
		this.setState({currentPage: number});
	},

	determineCurrentPageSearchResults: function () {
		var start, end, currentPageSearchResults;
		start = (this.state.currentPage - 1)*this.state.resultsPerPage;
		end = this.state.currentPage*this.state.resultsPerPage;
		currentPageSearchResults = this.state.activitySearchResults.slice(start, end);
		return currentPageSearchResults;
	},
	clickContinue: function () {
		$.ajax({
			url: '/teachers/classrooms/retrieve_classrooms_for_assigning_activities',  
			context: this,
			success: function (data) {
				this.clickContinueAjaxSuccess(data);
			},	
			error: function () {
				console.log('error ajaxing classrooms');
			}
		});
	},
	clickContinueAjaxSuccess: function (data) {
		this.setState({stage: 2, classroomsAndTheirStudents: data.classroomsAndTheirStudents});
	},

	render: function () {
		var currentPageSearchResults = this.determineCurrentPageSearchResults();
		var stageSpecificComponents, stage1Components, stage2Components;;
		
		stage1Components = (
			<span>
				<EC.NameTheUnit updateUnitName={this.updateUnitName} />
				<section>
					<h3 className="section-header">Select Activities</h3>
					<EC.SearchActivitiesInput updateSearchQuery={this.updateSearchQuery} />
					<EC.ActivitySearchFilters selectFilterOption={this.selectFilterOption} data={this.state.filters} />
					
					<table className='table' id='activities_table'>
						<thead>
							<EC.ActivitySearchSorts updateSort={this.updateSort} sorts={this.state.sorts} />	
						</thead>	
						<EC.ActivitySearchResults selectedActivities = {this.state.selectedActivities} currentPageSearchResults ={currentPageSearchResults} toggleActivitySelection={this.toggleActivitySelection} />							
					</table>

					<div className='fake-border'></div>

					<EC.Pagination maxPageNumber={this.state.maxPageNumber} selectPageNumber={this.selectPageNumber} currentPage={this.state.currentPage} numberOfPages={this.state.numberOfPages}  />

					<EC.SelectedActivities clickContinue={this.clickContinue} unitName={this.state.unitName} selectedActivities = {this.state.selectedActivities} toggleActivitySelection={this.toggleActivitySelection} />
				
				</section>
			</span>
		);
	
		stage2Components = (
			<span>hiii</span>


		);

		if (this.state.stage == 1) {
			stageSpecificComponents = stage1Components;
		} else {
			stageSpecificComponents = stage2Components;
		}

		return (
			<span>
				<EC.ProgressBar stage={this.state.stage}/>				
				<div className='container lesson_planner_main'>
					
					{stageSpecificComponents}

				</div>		
			</span>
		);

	}

});







