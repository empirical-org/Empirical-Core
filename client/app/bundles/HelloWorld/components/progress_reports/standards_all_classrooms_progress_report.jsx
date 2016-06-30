import React from 'react'
import ProgressReport from './progress_report.jsx'


export default  React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired,
    premiumStatus: React.PropTypes.string.isRequired
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
        field: '',
        sortByField: '',
        className: 'student-view-column',
        customCell: function(row) {
          return (
            <a className="student-view" href={row['students_href']}>Student View</a>
          );
        }
      },
      {
        name: '',
        field: '',
        sortByField: '',
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
          return <span>{row['proficient_student_count']} students</span>;
        }
      },
      {
        name: 'Not Yet Proficient',
        field: 'not_proficient_student_count',
        sortByField: 'not_proficient_student_count',
        className: 'not-proficient-column',
        customCell: function(row) {
          return <span>{row['not_proficient_student_count']} students</span>
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
      <ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'classrooms'}
                         exportCsv={'standards_classrooms'}
                         filterTypes={[]}
                         premiumStatus={this.props.premiumStatus}>
        <h2>Standards: All Classrooms</h2>
        <p className="description">Select Student View to see how each student is performing. Select Standard View to see how the entire class is performing on each each standard.</p>
      </ProgressReport>
    );
  }
});
