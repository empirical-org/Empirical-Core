
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
			activitySearchResults: [],
			selectedActivities : [],
			currentPage: 1,
			numberOfPages: 1,
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
			data: {
				searchQuery: this.state.query,
				filters: JSON.stringify(this.state.filters),
				sort: this.state.sort
			},
			success: this.searchRequestSuccess,
			error: function () {
				//console.log('error searching activities');
			}
		});

		
	},
	searchRequestSuccess: function (data) {
		console.log('filters before: ')
		console.log(this.state.filters)
		filters = _.map(this.state.filters, function (filter) {
			key = filter.field + 's';
			filter.options = data[key];
			return filter;
		}, this);


		hash = {
			activitySearchResults: data.activities,
			filters: filters,
			numberOfPages: data.number_of_pages
		}

		this.setState(hash);
		console.log('filters after: ')
		console.log(this.state.filters)
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
		filters = _.map(this.state.filters, function (filter) {
			if (filter.field == field) {
				filter.selected = optionId;
			}
			return filter;
		}, this);
		this.setState({filters: filters});
		this.searchRequest();

	},
	updateSort: function (field, asc_or_desc) {
		sorts = _.map(this.state.sorts, function (sort) {
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


	render: function () {
		return (
			<span>
				<div className="container">
					<section className="section-content-wrapper">

						<div className="bs-wizard">

			                <div className="select_activities_progress_bar col-xs-3 bs-wizard-step complete">
			                  <div className="progress"><div className="progress-bar"></div></div>
			                  <a href="#" className="bs-wizard-dot"></a>
			                  <div className="text-center bs-wizard-info">Select Activities</div>
			                </div>
			                
			                <div className="assign_activities_progress_bar col-xs-3 bs-wizard-step disabled">
								<div className="progress"><div className="progress-bar"></div></div>
								<a href="#" className="bs-wizard-dot"></a>
								<div className="text-center bs-wizard-info">Assign Activities</div>
			                </div>
			                
			                
			            </div>
					</section>
				</div>

				
				<div className='container lesson_planner_main'>
					<EC.NameTheUnit updateUnitName={this.updateUnitName} />
					<section>
						<h3 className="section-header">Select Activities</h3>
						<EC.SearchActivitiesInput updateSearchQuery={this.updateSearchQuery} />
						<EC.ActivitySearchFilters selectFilterOption={this.selectFilterOption} data={this.state.filters} />
						
						<table className='table' id='activities_table'>
							<thead>
								<EC.ActivitySearchSorts updateSort={this.updateSort} sorts={this.state.sorts} />	
							</thead>	
							<EC.ActivitySearchResults selectedActivities = {this.state.selectedActivities} activitySearchResults ={this.state.activitySearchResults} toggleActivitySelection={this.toggleActivitySelection} />							
						</table>

						<div className='fake-border'></div>

						<EC.Pagination currentPage = {this.state.currentPage} numberOfPages={this.state.numberOfPages}  />

						<EC.SelectedActivities unitName={this.state.unitName} selectedActivities = {this.state.selectedActivities} toggleActivitySelection={this.toggleActivitySelection} />
					
					</section>
				</div>



				
			</span>
		);

	}

});







