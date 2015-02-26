//= require ./table_filter_mixin.js
//= require ./table_sorting_mixin.js

EC.SectionsProgressReport = React.createClass({
  mixins: [EC.TableSortingMixin, EC.TableFilterMixin], // There's no pagination, so sorting can be done client-side.

  getDefaultProps: function() {
    return {
      tableColumns: [
        {
          name: 'Grade Level',
          field: 'section_name',
          sortByField: 'section_name',
          customCell: function(row) {
            return (
              <a href={row['section_link']}>{row['section_name']}</a>
            );
          }
        },
        {
          name: 'Standards Completed',
          field: 'topics_count',
          sortByField: 'topics_count'
        },
        {
          name: 'Proficient',
          field: 'proficient_count',
          sortByField: 'proficient_count'
        },
        {
          name: 'Not Proficient',
          field: 'not_proficient_count',
          sortByField: 'not_proficient_count'
        }
        // {
        //   name: 'Time Spent',
        //   field: 'total_time_spent',
        //   sortByField: 'total_time_spent'
        // }
      ]
    };
  },

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
      section_name: this.naturalSort,
      topics_count: this.numericSort,
      proficient_count: this.numericSort,
      not_proficient_count: this.numericSort,
      total_time_spent: this.numericSort
    }, {
        field: 'section_name',
        direction: 'asc'
    });

    this.fetchSections();
  },

  fetchSections: function() {
    $.get('/teachers/progress_reports/sections',
      this.state.currentFilters, function onSuccess(data) {
        this.setState({
          results: data.sections,
          classroomFilters: this.getFilterOptions(data.classrooms, 'name', 'id', 'All Classrooms'),
          studentFilters: this.getFilterOptions(data.students, 'name', 'id', 'All Students'),
          unitFilters: this.getFilterOptions(data.units, 'name', 'id', 'All Units')
        });
    }.bind(this));
  },

  selectClassroom: function(classroomId) {
    this.filterByField('classroom_id', classroomId, this.fetchSections);
  },

  // Filter sessions based on the student ID
  selectStudent: function(studentId) {
    this.filterByField('student_id', studentId, this.fetchSections);
  },

  // Filter sessions based on the unit ID
  selectUnit: function(unitId) {
    this.filterByField('unit_id', unitId, this.fetchSections);
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
        <EC.SortableTable rows={visibleResults} columns={this.props.tableColumns} sortHandler={this.sortResults} />
      </div>
    );
  }
});