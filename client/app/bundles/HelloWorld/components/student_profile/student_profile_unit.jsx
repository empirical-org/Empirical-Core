'use strict';
import React from 'react'
import _ from 'underscore'
import StudentProfileActivities from './student_profile_activities.jsx'


export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  render: function () {
    /*
    completed activities is just another fake table under unstarted activities
    */
    var headers = {
      finished: 'Completed Activities',
      not_finished: 'Assigned Activities'
    };
    var arr = [{data: this.props.data.not_finished, header: headers.not_finished},
           {data: this.props.data.finished, header: headers.finished}]

    var compacted = _.filter(arr, function (ele) { return ele.data }) // in case there are no finished, or no not_finished activity_sessions
    var count = _.reduce(compacted, function (acc, ele) {
      acc += ele.data.length
      return acc
    }, 0);

    var activities = _.map(compacted, function (ele) {
      return <StudentProfileActivities key={ele.header} data={ele.data} header={ele.header} count={count} />
    });
    return (
      <section>
        <h3 className="section-header">{this.props.data.unitName}</h3>
        {activities}
      </section>
    );
  }
});
