EC.StandardsAllClassroomsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Class Name',
        field: 'name',
        sortByField: 'name',
        className: 'class-name-column'
      },
      {
        name: '',
        field: 'name',
        sortByField: 'name',
        className: 'student-view-column',
        customCell: function(row) {
          return (
            <a className="student-view" href={row['students_href']}>Student View</a>
          );
        }
      },
      {
        name: '',
        field: 'name',
        sortByField: 'name',
        className: 'standard-view-column',
        customCell: function(row) {
          return (
            <a className="standard-view" href={row['topics_href']}>Standard View</a>
          );
        }
      },
      {
        name: 'Students',
        field: 'total_student_count',
        sortByField: 'total_student_count',
        className: 'students-column'
      },
      {
        name: 'Proficient',
        field: 'proficient_student_count',
        sortByField: 'proficient_student_count',
        className: 'proficient-column',
        customCell: function(row) {
          return <span className="proficient">{row['proficient_student_count']} students</span>;
        }
      },
      {
        name: 'Near Proficiency',
        field: 'near_proficient_student_count',
        sortByField: 'near_proficient_student_count',
        className: 'near-proficient-column',
        customCell: function(row) {
          return <span className="near-proficient">{row['near_proficient_student_count']} students</span>
        }
      },
      {
        name: 'Not Proficient',
        field: 'not_proficient_student_count',
        sortByField: 'not_proficient_student_count',
        className: 'not-proficient-column',
        customCell: function(row) {
          return <span className="not-proficient">{row['not_proficient_student_count']} students</span>
        }
      },
      {
        name: 'Standards',
        field: 'total_standard_count',
        sortByField: 'total_standard_count',
        className: 'standards-column'
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        name: 'natural',
        total_student_count: 'numeric',
        proficient_student_count: 'numeric',
        near_proficient_student_count: 'numeric',
        not_proficient_student_count: 'numeric',
        total_standard_count: 'numeric'
      },
      default: {
        field: 'name',
        direction: 'asc'
      }
    };
  },

  render: function() {
    return (
      <EC.ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'classrooms'}
                         exportCsv={'not_implemented'}
                         filterTypes={[]}>
        <h2>Standards: All Classrooms</h2>
        <p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla massa sem,
        interdum at condimentum id, lacinia vitae mi. Curabitur at mi sed risus varius venenatis et sed nibh.
        Vestibulum dictum.</p>
      </EC.ProgressReport>
    );
  }
});