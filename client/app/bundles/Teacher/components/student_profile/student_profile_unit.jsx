import React from 'react';
import _ from 'underscore';
import StudentProfileActivities from './student_profile_activities.jsx';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  render() {
    const arr = [{ data: this.props.data.incomplete, header: 'Assigned Activities', finished: false, },
           { data: this.props.data.complete, header: 'Completed Activities', finished: true, }];

    const compacted = _.filter(arr, ele => ele.data); // in case there are no finished, or no not_finished activity_sessions
    const count = _.reduce(compacted, (acc, ele) => {
      acc += ele.data.length;
      return acc;
    }, 0);
    const extant = this.props.data.incomplete ? this.props.data.incomplete[0] : this.props.data.complete[0];
    const activities = compacted.map(ele => <StudentProfileActivities key={ele.header} data={ele.data} header={ele.header} count={count} finished={ele.complete} />);
    return (
      <section>
        <h3 className="section-header">{extant.unit_name}</h3>
        {activities}
      </section>
    );
  },
});
