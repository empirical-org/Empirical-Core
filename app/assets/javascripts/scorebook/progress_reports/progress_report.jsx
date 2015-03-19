//= require ./table_filter_mixin.js
//= require ./table_sorting_mixin.js
//= require ./table_pagination_mixin.js

EC.ProgressReport = React.createClass({
  mixins: [EC.TableFilterMixin, EC.TablePaginationMixin, EC.TableSortingMixin],

  propTypes: {
    columnDefinitions: React.PropTypes.func.isRequired,
    pagination: React.PropTypes.bool.isRequired,
    sourceUrl: React.PropTypes.string.isRequired,
    clientSideFiltering: React.PropTypes.bool.isRequired,
    sortDefinitions: React.PropTypes.func.isRequired,
    jsonResultsKey: React.PropTypes.string.isRequired,
    onFetchSuccess: React.PropTypes.func, // Optional
    exportCsv: React.PropTypes.string
  },

  getInitialState: function() {
    return {
      results: [],
      classroomFilters: [],
      studentFilters: [],
      unitFilters: []
    };
  },

  componentDidMount: function() {
    var sortDefinitions = this.props.sortDefinitions();
    this.defineSorting(sortDefinitions.config, sortDefinitions.default);
    this.fetchData();
  },


  // Get results with all filters, sorting
  getFilteredResults: function() {
    var allResults = this.state.results;
    var filteredResults;
    if (this.props.clientSideFiltering) {
      filteredResults = this.applyFilters(allResults);
    } else {
      filteredResults = allResults; // Filtering takes place server-side.
    }
    return this.applySorting(filteredResults);
  },

  // Get results after pagination has been applied.
  getVisibleResults: function(filteredResults) {
    if (this.props.pagination) {
      return this.applyPagination(filteredResults, this.state.currentPage);
    } else {
      return filteredResults;
    }
  },

  // Filter sessions based on the classroom ID.
  selectClassroom: function(classroomId) {
    this.filterByField('classroom_id', classroomId, this.onFilterChange);
  },

  // Filter sessions based on the student ID
  selectStudent: function(studentId) {
    this.filterByField('student_id', studentId, this.onFilterChange);
  },

  // Filter sessions based on the unit ID
  selectUnit: function(unitId) {
    this.filterByField('unit_id', unitId, this.onFilterChange);
  },

  onFilterChange: function() {
    if (this.props.pagination) {
      this.resetPagination();
    } else if (!this.props.clientSideFiltering) {
      this.fetchData();
    }
  },

  fetchData: function() {
    $.get(this.props.sourceUrl, this.state.currentFilters, function onSuccess(data) {
      this.setState({
        results: data[this.props.jsonResultsKey],
        classroomFilters: this.getFilterOptions(data.classrooms, 'name', 'id', 'All Classrooms'),
        studentFilters: this.getFilterOptions(data.students, 'name', 'id', 'All Students'),
        unitFilters: this.getFilterOptions(data.units, 'name', 'id', 'All Units')
      });
      if (this.props.onFetchSuccess) {
        this.props.onFetchSuccess(data);
      }
    }.bind(this)).fail(function error(error) {
      console.log('An error occurred while fetching data', error);
    });
  },

  render: function() {
    var pagination, csvExport;
    var filteredResults = this.getFilteredResults();
    if (this.props.pagination) {
      var numberOfPages = this.calculateNumberOfPages(filteredResults);
      pagination = <EC.Pagination maxPageNumber={this.props.maxPageNumber}
                                  selectPageNumber={this.goToPage}
                                  currentPage={this.state.currentPage}
                                  numberOfPages={numberOfPages}  />;
    }
    var visibleResults = this.getVisibleResults(filteredResults);

    if (this.props.exportCsv) {
      csvExport = <EC.ExportCsv exportType={this.props.exportCsv} filters={this.state.currentFilters} />;
    }

    return (
      <div>
        <EC.ProgressReportFilters classroomFilters={this.state.classroomFilters}
                                  studentFilters={this.state.studentFilters}
                                  unitFilters={this.state.unitFilters}
                                  selectClassroom={this.selectClassroom}
                                  selectStudent={this.selectStudent}
                                  selectUnit={this.selectUnit} />
        {csvExport}
        <EC.SortableTable rows={visibleResults} columns={this.props.columnDefinitions()} sortHandler={this.sortResults} />
        {pagination}
      </div>
    );
  }
});