import React from 'react';
import _ from 'underscore';
import Unit from './unit';

export default React.createClass({

  render() {
    const units = _.map(this.props.data, function (data) {
			return (<Unit
  data={data}
  hideClassroomActivity={this.props.hideClassroomActivity}
  hideUnit={this.props.hideUnit}
  key={data.unitId}
  lesson={this.props.lesson}
  report={this.props.report}
  updateDueDate={this.props.updateDueDate}
			/>);
    }, this);
    return (
      <span>{units}</span>
    );
  },

});
