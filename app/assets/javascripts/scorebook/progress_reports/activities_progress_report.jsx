EC.ActivitiesProgressReport = React.createClass({

  getInitialState: function() {
    return {
      activitySessions: [],
      visibleActivitySessions: [],
      classroomFilters: []
    };
  },

  componentDidMount: function() {
    this.fetchActivitySessions();
  },

  // Handlers
  goToPage: function() {
    console.log('paginating', arguments);
  },

  // Filter sessions based on the classroom ID.
  selectClassroom: function(classroomId) {
    var visibleActivitySessions;
    if (!!classroomId) { // If classroom ID is provided
      visibleActivitySessions = _.where(this.state.activitySessions, {classroom_id: classroomId});
    } else {
      // An empty value means show all classrooms
      visibleActivitySessions = this.state.activitySessions;
      console.log('showing all activity sessions');
    }

    this.setState({visibleActivitySessions: visibleActivitySessions});
  },

  selectStudent: function(studentId) {
  },

  selectUnit: function(unitId) {
  },

  sortActivitySessions: function(sortByFieldName, sortDirection) {
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

    var activitySessions = this.state.activitySessions;
    activitySessions.sort(sortFunc);
    this.setState({activitySessions: activitySessions});
  },

  // Retrieve current state
  populateClassroomFilters: function() {
    // Grab and uniq all options based on the value (classroom ID).
    var allNames = _.chain(this.state.activitySessions).map(function(activitySession) {
      return {
        name: activitySession.classroom_name,
        value: activitySession.classroom_id
      };
    }).uniq(false, function(option) {
      return option.value;
    }).reject(function(option) {
      return option.value === null;
    }).value();
    allNames.unshift({name: 'All Classrooms', value: ''});
    this.setState({classroomFilters: allNames});
  },

  populateStudentFilters: function() {

  },

  populateUnitFilters: function() {

  },

  fetchActivitySessions: function() {
    $.get('/api/internal/progress_reports/activity_sessions', {
      // todo: request data
    }, _.bind(function success(data) {
      this.setState({
        activitySessions: data.activity_sessions, 
        visibleActivitySessions: data.activity_sessions
      }, function() {
        this.populateClassroomFilters();
      });
    }, this)).fail(function error(error) {
      console.log('An error occurred while fetching data', error);
    });
  },

  studentFilters: function() {
    return [{name: 'All Students', value: ''}];
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

  unitFilters: function() {
    return [{name: 'All Units', value: ''}];
  },

  render: function() {
    return (
      <div className="container">
        <EC.DropdownFilter defaultOption={'All Classrooms'} options={this.state.classroomFilters} selectOption={this.selectClassroom} />
        <EC.DropdownFilter defaultOption={'All Units'} options={this.unitFilters()} selectOption={this.selectUnit} />
        <EC.DropdownFilter defaultOption={'All Students'} options={this.studentFilters()} selectOption={this.selectStudent} />
        <EC.SortableTable rows={this.state.visibleActivitySessions} columns={this.tableColumns()} sortHandler={this.sortActivitySessions} />
        <EC.Pagination maxPageNumber={5} selectPageNumber={this.goToPage} currentPage={1} numberOfPages={3}  />
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

  // getDisplayedFilterOptions: function() {
    // var visibleOptions, isThereASelection, clearSelection;
    // isThereASelection = !!this.props.data.selected;

    // // Sort the options alphanumerically.
    // this.props.data.options.sort(function(a, b) {
    //   // This is kind of a hack, but all of the filter's options have a 'name' property.
    //   return s.naturalCmp(a.name, b.name);
    // });

    // if (isThereASelection) {
    //   visibleOptions = _.reject(this.props.data.options, {id: this.props.data.selected}, this);
    // } else {
    //   visibleOptions = this.props.data.options;
    // }

    // visibleOptions = _.map(visibleOptions, function (option) {
    //   return (
    //     <EC.FilterOption selectFilterOption={this.selectFilterOption} data={option} />
    //   );
    // }, this);

    // if (isThereASelection) {
    //   clearSelection = (
    //     <li onClick={this.clearFilterOptionSelection}>
    //       <span className='filter_option all'>
    //         {"All " + this.props.data.alias + "s "}
    //       </span>
    //     </li>
    //   );
    //   visibleOptions.unshift(clearSelection);
    // }       
    // return visibleOptions;
  // },

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