EC.TableFilterMixin = {
  getInitialState: function() {
    currentFilters: {}
  },

  applyFilters: function(results) {
    var visibleResults = results;

    _.each(this.state.currentFilters, function(value, fieldName) {
      if (!!value) {
        var filterCriteria = {};
        filterCriteria[fieldName] = value;
        visibleResults = _.where(visibleResults, filterCriteria);
      }
    });
    return visibleResults;
  },
  
  filterByField: function(fieldName, value) {
    // Set the filter state.
    var newState = {
      currentFilters: {}
    };
    newState.currentFilters[fieldName] = value;
    this.setState(newState);
    this.resetPagination();
  },

  // Abstract helper for the other populate functions
  populateFilters: function(nameField, valueField, allOptionName, stateProp) {
    // Grab and uniq all options based on the value (classroom ID).
    var allNames = _.chain(this.state.activitySessions).map(function(activitySession) {
      return {
        name: activitySession[nameField],
        value: activitySession[valueField]
      };
    }).uniq(false, function(option) {
      return option.value;
    }).reject(function(option) {
      return option.value === null;
    }).value();
    allNames.unshift({name: allOptionName, value: ''});
    var newState = {};
    newState[stateProp] = allNames;
    this.setState(newState);
  }
};

EC.TablePaginationMixin = {
  getDefaultProps: function() {
    // These appear to be static numbers, so they belong in properties.
    return {
      maxPageNumber: 4,
      resultsPerPage: 25
    }
  },

  getInitialState: function() {
    return {
      currentPage: 1    
    };
  },
  
  applyPagination: function(results, page) {
    // Ported from Stage1.determineCurrentPageSearchResults
    var start = (this.state.currentPage - 1) * this.props.resultsPerPage;
    var end = this.state.currentPage * this.props.resultsPerPage;
    return results.slice(start, end);
  },

  calculateNumberOfPages: function(visibleResults) {
    var numPages = Math.ceil(visibleResults.length / this.props.resultsPerPage);
    return numPages;
  },

  goToPage: function(page) {
    var newState = {
      currentPage: page,
    }
    this.setState(newState);
  },

  resetPagination: function() {
    this.setState({currentPage: 1});
  },
};

EC.TableSortMixin = {

};

EC.ActivitiesProgressReport = React.createClass({
  mixins: [EC.TableFilterMixin, EC.TablePaginationMixin],

  getInitialState: function() {
    return {
      activitySessions: [],
      classroomFilters: [],
      studentFilters: [],
      unitFilters: [],
      currentSort: {
        field: 'activity_classification_name',
        direction: 'asc'
      },
    };
  },

  componentDidMount: function() {
    this.fetchActivitySessions();
  },

  // Handlers
  applySorting: function(results) {
    var sortDirection = this.state.currentSort.direction,
        sortByFieldName = this.state.currentSort.field;
    // Flip the sign of the return value to sort in reverse
    var sign = (sortDirection === 'asc' ? 1 : -1);

    var sortFunc;
    switch(sortByFieldName) {
      case 'completed_at':
      case 'percentage':
      case 'time_spent':
        // Integer sort
        sortFunc = function(a, b) {
          return (a - b) * sign;
        };
      case 'activity_classification_name':
      case 'activity_name':
      case 'standard':
      default:
        // Alphanumeric sort
        sortFunc = function(a, b) {
          return s.naturalCmp(a[sortByFieldName], b[sortByFieldName]) * sign;
        };
    }

    results.sort(sortFunc);
    return results;
  },

  // Get results with all filters, sorting, and pagination applied
  getFilteredResults: function() {
    var allResults = this.state.activitySessions;
    return this.applySorting(this.applyFilters(allResults));
  },

  getVisibleResults: function(filteredResults) {
    return this.applyPagination(filteredResults, this.state.currentPage);
  },

  // Filter sessions based on the classroom ID.
  selectClassroom: function(classroomId) {
    this.filterByField('classroom_id', classroomId);
  },

  selectStudent: function(studentId) {
    this.filterByField('student_id', studentId);
  },

  selectUnit: function(unitId) {
    this.filterByField('unit_id', unitId);
  },

  sortActivitySessions: function(sortByFieldName, sortDirection) {
    this.setState({
      currentSort: {
        field: sortByFieldName,
        direction: sortDirection
      }
    });
  },

  // Retrieve current state

  populateClassroomFilters: function() {
    this.populateFilters('classroom_name', 'classroom_id', 'All Classrooms', 'classroomFilters');
  },

  populateStudentFilters: function() {
    this.populateFilters('student_name', 'student_id', 'All Students', 'studentFilters');
  },

  populateUnitFilters: function() {
    this.populateFilters('unit_name', 'unit_id', 'All Units', 'unitFilters');
  },

  fetchActivitySessions: function() {
    $.get('/api/internal/progress_reports/activity_sessions', {
      // todo: request data
    }, _.bind(function success(data) {
      this.setState({
        activitySessions: data.activity_sessions
      }, function() {
        this.populateClassroomFilters();
        this.populateUnitFilters();
        this.populateStudentFilters();
      });
    }, this)).fail(function error(error) {
      console.log('An error occurred while fetching data', error);
    });
  },

  tableColumns: function() {
    return [
      {
        name: 'App', 
        field: 'activity_classification_name',
        sortByField: 'activity_classification_name'
      },
      {
        name: 'Activity',
        field: 'activity_name',
        sortByField: 'activity_name'
      },
      {
        name: 'Date',
        field: 'display_completed_at',
        sortByField: 'completed_at',
      },
      {
        name: 'Time Spent',
        field: 'display_time_spent',
        sortByField: 'time_spent'
      },
      {
        name: 'Standard',
        field: 'standard', // What field is this?,
        sortByField: 'standard'
      },
      // {
      //   name: 'Concept'
      // }
      {
        name: 'Score',
        field: 'display_score',
        sortByField: 'percentage'
      }
    ];
  },

  render: function() {
    var filteredResults = this.getFilteredResults();
    var numberOfPages = this.calculateNumberOfPages(filteredResults);
    var visibleResults = this.getVisibleResults(filteredResults);
    return (
      <div className="container">
        <EC.DropdownFilter defaultOption={'All Classrooms'} options={this.state.classroomFilters} selectOption={this.selectClassroom} />
        <EC.DropdownFilter defaultOption={'All Units'} options={this.state.unitFilters} selectOption={this.selectUnit} />
        <EC.DropdownFilter defaultOption={'All Students'} options={this.state.studentFilters} selectOption={this.selectStudent} />
        <EC.SortableTable rows={visibleResults} columns={this.tableColumns()} sortHandler={this.sortActivitySessions} />
        <EC.Pagination maxPageNumber={this.props.maxPageNumber} selectPageNumber={this.goToPage} currentPage={this.state.currentPage} numberOfPages={numberOfPages}  />
      </div>
    );
  }
});

EC.SortableTable = React.createClass({
  propTypes: {
    columns: React.PropTypes.array.isRequired,
    rows: React.PropTypes.array.isRequired, // [{classification_name: 'foobar', ...}]
    sortHandler: React.PropTypes.func.isRequired // Handle sorting of columns
  },

  // Return a handler function that includes the field name as the 1st arg.
  sortByColumn: function(fieldName) {
    return _.bind(function sortHandler(sortDirection) {
      return this.props.sortHandler(fieldName, sortDirection);
    }, this);
  },

  columns: function() {
    return _.map(this.props.columns, function (column, i) {
      return <EC.SortableTh key={i} sortHandler={this.sortByColumn(column.sortByField)} displayName={column.name} />
    }, this);
  },

  rows: function() {
    return _.map(this.props.rows, function(row, i) {
      return <EC.SortableTr key={row.id} row={row} columns={this.props.columns} />
    }, this);
  },

  render: function() {
    return (
      <table className='table'>
        <thead>
          <tr>
            {this.columns()}
          </tr>
        </thead>
        <tbody>
          {this.rows()}
        </tbody>
      </table>
    );
  }
});

// Ported from EC.ActivitySearchSort
EC.SortableTh = React.createClass({
  propTypes: {
    displayName: React.PropTypes.string.isRequired,
    sortHandler: React.PropTypes.func.isRequired // Handle sorting of columns
  },

  getInitialState: function() {
    return {
      sortDirection: 'asc'
    };
  },

  arrowClass: function() {
    return this.state.sortDirection === 'desc' ? 'fa fa-caret-down' : 'fa fa-caret-up';
  },

  clickSort: function() {
    // Toggle the sort direction.
    var newDirection = (this.state.sortDirection === 'asc') ? 'desc' : 'asc';
    this.setState({sortDirection: newDirection}, _.bind(function() {
      this.props.sortHandler(newDirection);  
    }, this));
  },

  render: function() {
    return (
      <th className="sorter" onClick={this.clickSort}>
        {this.props.displayName}
        <i className={this.arrowClass()}></i>
      </th>
    );
  }
});

EC.SortableTr = React.createClass({
  propTypes: {
    row: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired
  },

  tds: function() {
    return _.map(this.props.columns, function (column, i) {
      return <td key={i}>{this.props.row[column.field]}</td>;
    }, this);
  },

  render: function() {
    return (
      <tr>
        {this.tds()}
      </tr>
    );
  }
});

EC.DropdownFilter = React.createClass({
  propTypes: {
    defaultOption: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    selectOption: React.PropTypes.func.isRequired
  },

  getFilterOptions: function() {
    return (
      <ul className="dropdown-menu" role="menu">
        {_.map(this.props.options, function(option, i) {
          return <EC.DropdownFilterOption key={i} name={option.name} value={option.value} selectOption={this.props.selectOption} />
        }, this)}
      </ul>
    );
  },

  render: function() {
    return (
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 no-pl">
        <div className="button-select">
          <button type="button" className="select-mixin select-gray button-select button-select-wrapper" data-toggle="dropdown">
            <i className="fa fa-caret-down"></i>
          </button>
          {this.getFilterOptions()}
        </div>
      </div>
    );
  }
});

EC.DropdownFilterOption = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    selectOption: React.PropTypes.func.isRequired
  },

  clickOption: function () {
    this.props.selectOption(this.props.value)
  },

  render: function () {
    return (
      <li onClick={this.clickOption}>
        <span className="filter_option">
          {this.props.name}
        </span>
      </li>
    );
  }
});

EC.DateRangeFilter = React.createClass({
  propTypes: {
    selectDates: React.PropTypes.func.isRequired
  },

  render: function() {
    return;
  }
});