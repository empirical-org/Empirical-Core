"use strict";
import React from 'react'
import { CSVDownload, CSVLink } from 'react-csv'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import LoadingSpinner from '../shared/loading_indicator.jsx'
import request from 'request'

export default React.createClass({

  getInitialState: function() {
    return {
      csvData: [],
      loading: true,
      errors: false
    }
  },

  componentDidMount: function() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/progress_reports/activity_sessions.json"`
    }, (e, r, body) => {
      // const data = JSON.parse(body).data
      // const csvData = this.formatDataForCSV(data)
      // const classroomsData = this.formatClassroomsData(data)
      // // gets unique classroom names
      // const classroomNames = [...new Set(classroomsData.map(row => row.classroom_name))]
      // classroomNames.unshift(showAllClassroomKey)
      that.setState({
        loading: false,
        errors: body.errors,
        // classroomsData,
        // csvData,
        // classroomNames
      });
    });
  },

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

  renderTable: function() {
    if(this.state.loading) {
      return <LoadingSpinner />
    }

    return("Table.")
  },

  render: function() {
    return (
      <div className='progress-reports-2018'>
        <div className='activity-scores-overview flex-row space-between'>
          <div className='header-and-info'>
            <h1>Data Export</h1>
            <p>You can export the data as a CSV file by filtering for the classrooms, activity packs, or students you would like to export and then pressing "Download Report."</p>
          </div>
          <div className='csv-and-how-we-grade'>
            <CSVLink data={this.state.csvData} target='_blank'>
              <button className='btn button-green'>Download Report</button>
            </CSVLink>
            <a className='how-we-grade' href="https://support.quill.org/activities-implementation/how-does-grading-work">How We Grade<i className="fa fa-long-arrow-right" /></a>
          </div>
        </div>
        {this.renderTable()}
      </div>
    );
  }
});
