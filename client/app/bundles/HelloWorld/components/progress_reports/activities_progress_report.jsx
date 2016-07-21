"use strict";
import React from 'react'
import ProgressReport from './progress_report.jsx'


export default React.createClass({
  propTypes: {
    sourceUrl: React.PropTypes.string.isRequired,
    premiumStatus: React.PropTypes.string.isRequired
  },

  columnDefinitions: function() {
    // Student, Date, Activity, Score, Standard, App
    return [
      {
        name: 'Student',
        field: 'student_name',
        sortByField: 'student_name',
        className: 'student-name-column'
      },
      {
        name: 'Date',
        field: 'display_completed_at',
        sortByField: 'completed_at',
        className: 'date-column'
      },
      {
        name: 'Activity',
        field: 'activity_name',
        sortByField: 'activity_name',
        className: 'activity-name-column'
      },
      {
        name: 'Score',
        field: 'display_score',
        sortByField: 'percentage',
        className: 'score-column'
      },
      {
        name: 'Standard',
        field: 'standard',
        sortByField: 'standard',
        className: 'standard-prefix-column'
      },
      {
        name: 'App',
        field: 'activity_classification_name',
        sortByField: 'activity_classification_name',
        className: 'app-name-column'
      }
    ];
  },

  sortDefinitions: function() {
    return {
      config: {
        completed_at: 'numeric',
        percentage: 'numeric',
        activity_name: 'natural',
        activity_classification_name: 'natural',
        standard: 'natural',
        student_name: 'natural'
      },
      default: {
        field: 'completed_at',
        direction: 'desc'
      }
    };
  },

  render: function() {
    return (
      <ProgressReport columnDefinitions={this.columnDefinitions}
                         pagination={true}
                         sourceUrl={this.props.sourceUrl}
                         sortDefinitions={this.sortDefinitions}
                         jsonResultsKey={'activity_sessions'}
                         exportCsv={'activity_sessions'}
                         filterTypes={['unit', 'classroom', 'student']}
                         premiumStatus={this.props.premiumStatus}>
        <h2>Activities: All Students</h2>
        <p className="description">View all of the activities your students have completed. Filter by classroom, unit, or student.</p>
      </ProgressReport>
    );
  }
});
