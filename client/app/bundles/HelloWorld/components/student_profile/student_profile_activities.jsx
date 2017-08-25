import React from 'react';
import StudentProfileActivity from './student_profile_activity.jsx';
import _ from 'underscore';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.array.isRequired,
    header: React.PropTypes.string.isRequired,
  },

  showDueDateColumn() {
    if (this.props.data.some(as => as.due_date)) {
      return <span className="header-list-due-date">Due Date</span>;
    }
      // necessary for styling
    return <span />;
  },

  render() {
    const activities = _.map(this.props.data, ele => <StudentProfileActivity key={ele.id} data={ele} finished={this.props.finished} />);
    if (this.props.data.length > 0) {
      return (<div className="fake-table">
        <div className="header">{this.props.header}
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
