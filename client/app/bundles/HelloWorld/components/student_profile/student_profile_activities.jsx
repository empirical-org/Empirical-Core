'use strict';
import React from 'react'
import StudentProfileActivity from './student_profile_activity.jsx'


export default React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    header: React.PropTypes.string.isRequired
  },

  sayCount: function () {
    return [this.props.data.length, 'of', this.props.count].join(' ');
  },

  render: function () {
    var result;
    var activities = _.map(this.props.data, function (ele) {
      return <StudentProfileActivity key={ele.id} data={ele} />
    });
    if (this.props.data.length > 0) {
     result = <div className="fake-table">
        <div className="header">{this.props.header}
          <span className="header-list-counter">{this.sayCount()}</span>
        </div>
        {activities}
      </div>
    } else {
      result = <span></span>
    }
    return result;
  }
})
