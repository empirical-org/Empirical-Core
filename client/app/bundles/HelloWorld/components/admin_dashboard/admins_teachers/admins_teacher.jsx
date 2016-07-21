'use strict'
import React from 'react'
export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <span>
        <div>{this.props.data.name}</div>
        <div>
          <span>Number of students</span>
          <span>&nbsp;{this.props.data.number_of_students}</span>
        </div>
        <div>
          <span>Number of questions completed</span>
          <span>&nbsp;{this.props.data.number_of_questions_completed}</span>
        </div>
        <div>
          <span>Time spent</span>
          <span>&nbsp;{this.props.data.time_spent}</span>
        </div>
        <a href={this.props.data.classroom_manager_path}>Class Manager</a>
        <a href={this.props.data.progress_reports_path}>Progress Reports</a>
      </span>
    )
  }
});
