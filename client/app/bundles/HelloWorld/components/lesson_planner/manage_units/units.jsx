'use strict'

 import React from 'react'
 import _ from 'underscore'
 import Unit from './unit'
 import EmptyAssignedUnits from './EmptyAssignedUnits.jsx'

 export default React.createClass({
	render: function () {
		var units = _.map(this.props.data, function (data) {
      if (data.classroom_activities.length > 0) {
  			return (<Unit   key={data.unit.id}
                hideClassroomActivity={this.props.hideClassroomActivity}
                hideUnit={this.props.hideUnit}
                report={this.props.report}
                lesson={this.props.lesson}
                updateDueDate={this.props.updateDueDate}
  							data={data}
                />);
      }}, this);
		return (
			<span>{units}</span>
		);
	}

});
