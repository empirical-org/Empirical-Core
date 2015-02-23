EC.SectionsProgressReport = React.createClass({
  mixins: [EC.TableSortingMixin], // There's no pagination, so sorting can be done client-side.

  getDefaultProps: function() {
    return {
      tableColumns: [
        {
          name: 'Grade Level', 
          field: 'section_name',
          sortByField: 'section_name'
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
        },
        {
          name: 'Time Spent',
          field: 'total_time_spent',
          sortByField: 'total_time_spent'
        }
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
    $.get('/teachers/progress_reports/sections', function(data) {
      this.setState({
        results: data.sections,
        classroomFilters: this.mapClassroomFilters(data.classrooms),
        studentFilters: this.mapStudentFilters(data.students),
        unitFilters: this.mapUnitFilters(data.units)
      });
    }.bind(this))
  },

  mapClassroomFilters: function(classrooms) {
    return classrooms.map(function(classroom) {
      return {
        name: classroom.name,
        value: classroom.id
      };
    });
  },

  mapStudentFilters: function(students) {
    return students.map(function(student) {
      return {
        name: student.name,
        value: student.id
      };
    });
  },

  mapUnitFilters: function(units) {
    return units.map(function(unit) {
      return {
        name: unit.name,
        value: unit.id
      }
    });
  },

  selectClassroom: function(classroomId) {
  },

  // Filter sessions based on the student ID
  selectStudent: function(studentId) {
  },

  // Filter sessions based on the unit ID
  selectUnit: function(unitId) {
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