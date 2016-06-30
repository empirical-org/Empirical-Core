"use strict";
import React from 'react'
import ProgressReport from './progress_report.jsx'


export default  React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      classroom: {}
    };
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Standard Level',
        field: 'section_name',
        sortByField: 'section_name',
        className: 'standard-level-column'
      },
      {
        name: 'Standard Name',
        field: 'name',
        sortByField: 'name',
        className: 'standard-name-column',
        customCell: function(row) {
          return (
            <a className="student-view" href={row['topic_students_href']}>{row['name']}</a>
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
  },

  sortDefinitions: function() {
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
  },

  onFetchSuccess: function(responseData) {
    this.setState({
      classroom: responseData.classroom
    });
  },

  render: function() {
    return (
      <ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'topics'}
                         exportCsv={'standards_classroom_topics'}
                         onFetchSuccess={this.onFetchSuccess}
                         filterTypes={['unit']}>
        <h2>Standards by Class: {this.state.classroom.name}</h2>
      </ProgressReport>
    );
  }

});
