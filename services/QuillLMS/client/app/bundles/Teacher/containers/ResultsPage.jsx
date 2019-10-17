'use strict'

import React from 'react'
import _ from 'lodash'
import ScrollToTop from '../components/shared/scroll_to_top'
import ResultsIcon from '../components/activities/results_page/results_icon.jsx'
import StudentResultsTables from '../components/activities/results_page/student_results_tables.jsx'

export default React.createClass({
  headerButton: function () {
    if (this.props.integrationPartnerName && this.props.integrationPartnerSessionId) {
      const link = `/${this.props.integrationPartnerName}?session_id=${this.props.integrationPartnerSessionId}`;
      return (<a href={link}>
        <button className='btn button-green'>
          Back to Activity List<i aria-hidden="true" className="fa fa-long-arrow-right" />
        </button>
      </a>)
    } else if (this.props.anonymous) {
      return (<a href='/account/new'>
        <button className='btn button-green'>
          Sign Up<i aria-hidden="true" className="fa fa-long-arrow-right" />
        </button>
      </a>)
    } else {
      const link = this.props.classroomId ? `/classrooms/${this.props.classroomId}` : '/profile'
      return (
        <a href={link}>
          <button className='btn button-green'>
            Back to Your Dashboard<i aria-hidden="true" className="fa fa-long-arrow-right" />
          </button>
        </a>
      )
    }
  },

  headerMessage: function() {
    return (
      <div>
        <h1>
          Activity Complete!
        </h1>
        <h3>
          You completed the activity: {this.props.activityName}
        </h3>
        {this.headerButton()}
      </div>
    );
  },

  render: function() {
    return (
      <div
        className='container-fluid'
        id='results-page'
      >
        <ScrollToTop />
        <div className='top-section'>
          <ResultsIcon
            activityType={this.props.activityType}
            percentage={this.props.percentage}
          />
          {this.headerMessage()}
        </div>
        <div className='bottom-section'>
          <div className='results-wrapper'>
            <StudentResultsTables results={this.props.results} />
          </div>
        </div>
      </div>
    );
  }

});
