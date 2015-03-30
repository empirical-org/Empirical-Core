EC.StandardsAllClassroomsProgressReport = React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Class Name',
        field: 'name',
        sortByField: 'name'
      },
      {
        name: '',
        field: 'name',
        sortByField: 'name',
        customCell: function(row) {
          return (
            <a href={row['students_href']}>Student View</a>
          );
        }
      },
      {
        name: '',
        field: 'name',
        sortByField: 'name',
        customCell: function(row) {
          return (
            <a href={row['standards_href']}>Standard View</a>
          );
        }
      },
      {
        name: 'Students',
        field: 'total_student_count',
        sortByField: 'total_student_count'
      },
      {
        name: 'Proficient',
        field: 'proficient_student_count',
        sortByField: 'proficient_student_count'
      },
      {
        name: 'Near Proficiency',
        field: 'near_proficient_student_count',
        sortByField: 'near_proficient_student_count'
      },
      {
        name: 'Not Proficient',
        field: 'not_proficient_student_count',
        sortByField: 'not_proficient_student_count'
      },
      {
        name: 'Standards',
        field: 'total_standard_count',
        sortByField: 'total_standard_count'
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
                         pagination={true}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'classrooms'}
                         exportCsv={'classrooms'} />
    );
  }
});