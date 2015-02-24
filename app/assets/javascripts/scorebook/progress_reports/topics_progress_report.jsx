//= require ./table_filter_mixin.js
//= require ./table_sorting_mixin.js

EC.TopicsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  mixins: [EC.TableSortingMixin, EC.TableFilterMixin], // There's no pagination, so sorting can be done client-side.

  getInitialState: function() {
    return {
      classroomFilters: [],
      studentFilters: [],
      unitFilters: [],
      results: []
    }
  },

  componentDidMount: function() {
    this.defineSorting({
      name: this.naturalSort
    }, {
        field: 'name',
        direction: 'asc'
    });

    this.fetchData();
  },

  // Table columns need to be defined dynamically
  // because table headers display section data.
  getTableColumns: function() {
    // Derive column names from this.state.section
    return [
      {
        name: 'Topic Name',
        field: 'name',
        sortByField: 'name'
      }
    ];
  },

  fetchData: function() {
    $.get(this.props.sourceUrl, this.state.currentFilters, function onSuccess(data) {
        this.setState({
          results: data.topics,
          classroomFilters: this.getFilterOptions(data.classrooms, 'name', 'id', 'All Classrooms'),
          studentFilters: this.getFilterOptions(data.students, 'name', 'id', 'All Students'),
          unitFilters: this.getFilterOptions(data.units, 'name', 'id', 'All Units')
        });
    }.bind(this));
  },

  render: function() {
    var visibleResults = this.applySorting(this.state.results);
    return (
      <div className="container">
        <EC.ProgressReportFilters classroomFilters={this.state.classroomFilters}
                                  studentFilters={this.state.studentFilters}
                                  unitFilters={this.state.unitFilters}
                                  selectClassroom={this.selectClassroom}
                                  selectStudent={this.selectStudent}
                                  selectUnit={this.selectUnit} />
        <EC.SortableTable rows={visibleResults} columns={this.getTableColumns()} sortHandler={this.sortResults} />
      </div>
    );
  }
});