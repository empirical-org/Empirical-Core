EC.Stage1 = React.createClass({
  getInitialState: function() {
    return {
      activitySearchResults: [],
      currentPageSearchResults: [],
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
          field: 'topicCategory',
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
          asc_or_desc: 'asc'
        },
        {
          field: 'activity',
          alias: 'Activity',
          selected: false,
          asc_or_desc: 'asc'
        },
        {
          field: 'section',
          alias: 'Standard Level',
          selected: false,
          asc_or_desc: 'asc'
        },
        {
          field: 'topicCategory',
          alias: 'Concept',
          selected: false,
          asc_or_desc: 'asc'
        }
      ]
    }
  },

  componentDidMount: function () {
    this.searchRequest();
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
    var key;
    var filters = _.map(this.state.filters, function (filter) {
      if (filter.field == 'topicCategory') {
        key = 'topic_categories';
      } else {
        key = filter.field + 's';
      }
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

  determineCurrentPageSearchResults: function () {
    var start, end, currentPageSearchResults;
    start = (this.state.currentPage - 1)*this.state.resultsPerPage;
    end = this.state.currentPage*this.state.resultsPerPage;
    currentPageSearchResults = this.state.activitySearchResults.slice(start, end);
    return currentPageSearchResults;
  },

  updateSearchQuery: function (newQuery) {
    console.log('update search query')
    console.log(newQuery)
    
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
        sort.asc_or_desc = 'asc'
      }
      return sort;
    }, this);
    this.setState({sorts: sorts});
    this.searchRequest();
  },
  selectPageNumber: function (number) {
    this.setState({currentPage: number});
  },

  render: function() {
    var currentPageSearchResults = this.determineCurrentPageSearchResults();
    return (
      <span>
        <EC.NameTheUnit updateUnitName={this.props.updateUnitName} />
        <section>
          <h3 className="section-header">Select Activities</h3>
          <EC.SearchActivitiesInput updateSearchQuery={this.updateSearchQuery} />
          <EC.ActivitySearchFilters selectFilterOption={this.selectFilterOption} data={this.state.filters} />
          
          <table className='table' id='activities_table'>
            <thead>
              <EC.ActivitySearchSorts updateSort={this.updateSort} sorts={this.state.sorts} />  
            </thead>  
            <EC.ActivitySearchResults selectedActivities = {this.props.selectedActivities} currentPageSearchResults ={currentPageSearchResults} toggleActivitySelection={this.props.toggleActivitySelection} />
          </table>

          <div className='fake-border'></div>

          <EC.Pagination maxPageNumber={this.state.maxPageNumber} selectPageNumber={this.selectPageNumber} currentPage={this.state.currentPage} numberOfPages={this.state.numberOfPages}  />

          <EC.SelectedActivities clickContinue={this.props.clickContinue} unitName={this.state.unitName} selectedActivities = {this.props.selectedActivities} toggleActivitySelection={this.props.toggleActivitySelection} />
        
        </section>
      </span>
    );
  }
});