EC.ConceptCategoriesProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  mixins: [EC.TableSortingMixin, EC.TableFilterMixin], // There's no pagination, so sorting can be done client-side.

  getInitialState: function() {
    return {
      classroomFilters: [],
      studentFilters: [],
      unitFilters: [],
      results: [],
      section: {}
    }
  },

  getDefaultProps: function() {
    return {
      tableColumns: [
        {
          name: 'Concept Category',
          field: 'concept_category_name',
          sortByField: 'concept_category_name'
          // customCell: function(row) {
          //   return (
          //     <a href={row['section_link']}>{row['section_name']}</a>
          //   );
          // }
        },
        {
          name: 'Total Results',
          field: 'total_result_count',
          sortByField: 'total_result_count'
        },
        {
          name: 'Correct Results',
          field: 'correct_result_count',
          sortByField: 'correct_result_count'
        },
        {
          name: 'Incorrect Results',
          field: 'incorrect_result_count',
          sortByField: 'incorrect_result_count'
        }
      ]
    };
  },

  componentDidMount: function() {
    this.defineSorting({
      concept_category_name: this.naturalSort,
      total_result_count: this.numericSort,
      correct_result_count: this.numericSort,
      incorrect_result_count: this.numericSort
    }, {
        field: 'concept_category_name',
        direction: 'asc'
    });

    this.fetchData();
  },

  fetchData: function() {
    $.get(this.props.sourceUrl, this.state.currentFilters, function onSuccess(data) {
        this.setState({
          results: data.concept_categories,
          classroomFilters: this.getFilterOptions(data.classrooms, 'name', 'id', 'All Classrooms'),
          studentFilters: this.getFilterOptions(data.students, 'name', 'id', 'All Students'),
          unitFilters: this.getFilterOptions(data.units, 'name', 'id', 'All Units')
        });
    }.bind(this));
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

  render: function() {
    // var visibleResults = this.applySorting(this.state.results);
    var visibleResults = this.state.results;

    return (
      <div className="container">
        <EC.ProgressReportFilters classroomFilters={this.state.classroomFilters}
                                  studentFilters={this.state.studentFilters}
                                  unitFilters={this.state.unitFilters}
                                  selectClassroom={this.selectClassroom}
                                  selectStudent={this.selectStudent}
                                  selectUnit={this.selectUnit} />
        <EC.SortableTable rows={visibleResults} columns={this.props.tableColumns} sortHandler={this.sortResults} />
      </div>
    );
  }
});