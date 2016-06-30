"use strict";
import React from 'react'
import ProgressReport from './progress_report.jsx'
import MasteryStatus from './mastery_status.jsx'


export default  React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired,
    premiumStatus: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      topic: {}
    };
  },

  columnDefinitions: function() {
    return [
      {
        name: 'Student Name',
        field: 'name',
        sortByField: 'sorting_name',
        className: 'student-name-column',
        customCell: function(row) {
          return (
            <a className="student-view" href={row['student_topics_href']}>{row['name']}</a>
          );
        }
      },
      {
        name: 'Activities',
        field: 'total_activity_count',
        sortByField: 'total_activity_count',
        className: 'activities-column'
      },
      {
        name: 'Average',
        field: 'average_score',
        sortByField: 'average_score',
        className: 'average-score-column',
        customCell: function(row) {
          return Math.round(row['average_score'] * 100) + '%';
        }
      },
      {
        name: 'Mastery Status',
        field: 'average_score',
        sortByField: 'average_score',
        className: 'average-score-column',
        customCell: function(row) {
          return <MasteryStatus score={row['average_score']} />;
        }
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        sorting_name: 'natural',
        total_activity_count: 'numeric',
        average_score: 'numeric'
      },
      default: {
        field: 'sorting_name',
        direction: 'asc'
      }
    };
  },

  onFetchSuccess: function(responseData) {
    this.setState({
      topic: responseData.topic
    });
  },

  render: function() {
    return (
      <ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={false}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'students'}
                         exportCsv={'standards_topic_students'}
                         onFetchSuccess={this.onFetchSuccess}
                         filterTypes={['unit']}
                         premiumStatus={this.props.premiumStatus}>
        <h2>Standards: {this.state.topic.name}</h2>
      </ProgressReport>
    );
  }
});
