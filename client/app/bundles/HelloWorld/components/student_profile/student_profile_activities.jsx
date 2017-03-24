'use strict';
import React from 'react'
import StudentProfileActivity from './student_profile_activity.jsx'
import _ from 'underscore';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    header: React.PropTypes.string.isRequired
  },

  sayCount: function () {
    return [this.props.data.length, 'of', this.props.count].join(' ');
  },

  showDueDateColumn: function () {
    if (this.props.data.some((as) => as.due_date)) {
      return <span className="header-list-due-date">Due Date</span>
    } else {
      // necessary for styling
      return <span></span>
    }
  },

  render: function () {
    var result;
    var activities = _.map(this.props.data, (ele) => {
      return <StudentProfileActivity key={ele.id} data={ele} finished={this.props.finished} />
    });
    if (this.props.data.length > 0) {
     result = <div className="fake-table">
        <div className="header">{this.props.header}
          <span className="header-list">
          {this.showDueDateColumn()}
          <span className="header-list-counter">{this.sayCount()}</span>
          </span>
        </div>
        {activities}
      </div>
    } else {
      result = <span></span>
    }
    return result;
  }
})
