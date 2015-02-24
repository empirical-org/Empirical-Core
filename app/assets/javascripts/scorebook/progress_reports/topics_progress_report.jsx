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
      topic_name: this.naturalSort,
      students_count: this.numericSort,
      proficient_count: this.numericSort,
      not_proficient_count: this.numericSort
    }, {
        field: 'topic_name',
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
        field: 'topic_name',
        sortByField: 'topic_name'
      },
      {
        name: 'students',
        field: 'students_count',
        sortByField: 'students_count'
      },
      {
        name: 'proficient',
        field: 'proficient_count',
        sortByField: 'proficient_count'
      },
      {
        name: 'not proficient',
        field: 'not_proficient_count',
        sortByField: 'not_proficient_count'
      }
    ];
  },

  selectClassroom: function(classroomId) {
    this.filterByField('classroom_id', classroomId, this.fetchData);
  },

  // Filter sessions based on the student ID
  selectStudent: function(studentId) {
    this.filterByField('student_id', studentId, this.fetchData);
  },

  // Filter sessions based on the unit ID
  selectUnit: function(unitId) {
    this.filterByField('unit_id', unitId, this.fetchData);
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