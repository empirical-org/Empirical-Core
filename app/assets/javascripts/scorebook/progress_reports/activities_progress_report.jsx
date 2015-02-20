//= require ./table_pagination_mixin.js
//= require ./table_filter_mixin.js
//= require ./table_sorting_mixin.js

EC.ActivitiesProgressReport = React.createClass({
  mixins: [EC.TableFilterMixin, EC.TablePaginationMixin, EC.TableSortingMixin],

  getInitialState: function() {
    return {
      activitySessions: [],
      classroomFilters: [],
      studentFilters: [],
      unitFilters: []
    };
  },

  componentDidMount: function() {
    this.defineSorting({
      completed_at: this.numericSort,
      percentage: this.numericSort,
      time_spent: this.numericSort,
      activity_classification_name: this.naturalSort,
      activity_name: this.naturalSort,
      standard: this.naturalSort
    }, {
        field: 'activity_classification_name',
        direction: 'asc'
    });
    this.fetchActivitySessions();
  },

  // Handlers

  // Get results with all filters, sorting
  getFilteredResults: function() {
    var allResults = this.state.activitySessions;
    return this.applySorting(this.applyFilters(allResults));
  },

  // Get results after pagination has been applied.
  getVisibleResults: function(filteredResults) {
    return this.applyPagination(filteredResults, this.state.currentPage);
  },

  // Filter sessions based on the classroom ID.
  selectClassroom: function(classroomId) {
    this.filterByField('classroom_id', classroomId);
  },

  // Filter sessions based on the student ID
  selectStudent: function(studentId) {
    this.filterByField('student_id', studentId);
  },

  // Filter sessions based on the unit ID
  selectUnit: function(unitId) {
    this.filterByField('unit_id', unitId);
  },

  // Retrieve current state
  populateClassroomFilters: function() {
    var options = this.getFilterOptions(this.state.activitySessions,
      'classroom_name', 'classroom_id', 'All Classrooms');
    this.setState({
      classroomFilters: options
    });
  },

  populateStudentFilters: function() {
    var options = this.getFilterOptions(this.state.activitySessions,
      'student_name', 'student_id', 'All Students');
    this.setState({
      studentFilters: options
    });
  },

  populateUnitFilters: function() {
    var options = this.getFilterOptions(this.state.activitySessions,
      'unit_name', 'unit_id', 'All Units');
    this.setState({
      unitFilters: options
    });
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
        <div className="row activity-page-dropdown-wrapper">
          <EC.DropdownFilter defaultOption={'All Classrooms'} options={this.state.classroomFilters} selectOption={this.selectClassroom} />
          <EC.DropdownFilter defaultOption={'All Units'} options={this.state.unitFilters} selectOption={this.selectUnit} />
          <EC.DropdownFilter defaultOption={'All Students'} options={this.state.studentFilters} selectOption={this.selectStudent} />
        </div>
        <EC.SortableTable rows={visibleResults} columns={this.tableColumns()} sortHandler={this.sortResults} />
        <EC.Pagination maxPageNumber={this.props.maxPageNumber} selectPageNumber={this.goToPage} currentPage={this.state.currentPage} numberOfPages={numberOfPages}  />
      </div>
    );
  }
});