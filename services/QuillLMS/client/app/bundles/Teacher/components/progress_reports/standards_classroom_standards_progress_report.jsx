import React from 'react'
import ProgressReport from './progress_report.jsx'

export default class StandardsByClassroomProgressReport extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      classroom: {}
    };
  }

  columnDefinitions = () => {
    return [
      {
        name: 'Standard Level',
        field: 'standard_level_name',
        sortByField: 'standard_level_name',
        className: 'standard-level-column'
      },
      {
        name: 'Standard Name',
        field: 'name',
        sortByField: 'name',
        className: 'standard-name-column',
        customCell: function(row) {
          return (
            <a className="student-view" href={row['standard_students_href']}>{row['name']}</a>
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
        name: 'Not yet proficient',
        field: 'not_proficient_student_count',
        sortByField: 'not_proficient_student_count',
        className: 'not-proficient-column',
        customCell: function(row) {
          return <span>{row['not_proficient_student_count']} students</span>;
        }
      },
      {
        name: 'Activities',
        field: 'total_activity_count',
        sortByField: 'total_activity_count',
        className: 'activities-column'
      }
    ];
  };

  sortDefinitions = () => {
    return {
      config: {
        name: 'natural',
        total_student_count: 'numeric',
        proficient_student_count: 'numeric',
        not_proficient_student_count: 'numeric',
        total_activity_count: 'numeric'
      },
      default: {
        field: 'name',
        direction: 'asc'
      }
    };
  };

  onFetchSuccess = (responseData) => {
    this.setState({
      classroom: responseData.classroom
    });
  };

  render() {
    return (
      <ProgressReport
        columnDefinitions={this.columnDefinitions}
        exportCsv="standards_classroom_standards"
        filterTypes={['unit']}
        jsonResultsKey="standards"
        onFetchSuccess={this.onFetchSuccess}
        pagination={false}
        sortDefinitions={this.sortDefinitions}
        sourceUrl={this.props.sourceUrl}
      >
        <h2>Standards by Class: {this.state.classroom.name}</h2>
      </ProgressReport>
    );
  }
}
