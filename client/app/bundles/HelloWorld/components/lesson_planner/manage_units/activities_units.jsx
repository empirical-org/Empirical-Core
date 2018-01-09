import React from 'react';
import _ from 'underscore';
import Unit from './activities_unit';

export default React.createClass({

  render() {
    const units = _.map(this.props.data, function (data) {
  			return (<Unit
    key={data.unitId}
    hideClassroomActivity={this.props.hideClassroomActivity}
    hideUnit={this.props.hideUnit}
    report={this.props.report}
    activityReport={this.props.activityReport}
    lesson={this.props.lesson}
    updateDueDate={this.props.updateDueDate}
    data={data}
    updateMultipleDueDates={this.props.updateMultipleDueDates}
  			/>);
    }, this);
    return (
      <span>{units}</span>
    );
  },

});
