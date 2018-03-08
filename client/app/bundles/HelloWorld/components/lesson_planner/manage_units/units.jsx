import React from 'react'
import createReactClass from 'create-react-class';
import _ from 'underscore';
import Unit from './unit';

export default createReactClass({

  render() {
    const units = _.map(this.props.data, function (data) {
  			return (<Unit
    key={data.unitId}
    hideClassroomActivity={this.props.hideClassroomActivity}
    hideUnit={this.props.hideUnit}
    report={this.props.report}
    lesson={this.props.lesson}
    updateDueDate={this.props.updateDueDate}
    data={data}
  			/>);
    }, this);
    return (
      <span>{units}</span>
    );
  },

});
