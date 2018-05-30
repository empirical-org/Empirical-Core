import React from 'react';
import StudentProfileActivity from './student_profile_activity.jsx';
import _ from 'underscore';

export default React.createClass({

  showDueDateColumn() {
    if (this.props.data.some(as => as.due_date)) {
      return <span className="header-list-due-date">Due Date</span>;
    }
      // necessary for styling
    return <span />;
  },

  render() {
    const activities = this.props.data.map(ele => <StudentProfileActivity key={ele.ca_id} data={ele} />);
    if (this.props.data.length > 0) {
      return (<div className="fake-table">
        <div className="header">
          <span className="header-text">{this.props.header}</span>
          <span className="header-list">
            {this.showDueDateColumn()}
            <span className="header-list-counter">{`${this.props.data.length} of ${this.props.count}`}</span>
          </span>
        </div>
        {activities}
      </div>);
    }
    return <span />;
  },
});
