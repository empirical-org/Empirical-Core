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
                deleteClassroomActivity={this.props.deleteClassroomActivity}
                hideUnit={this.props.hideUnit}
                report={this.props.report}
                updateDueDate={this.props.updateDueDate}
  							data={data}
                />);
  		} else {
        return <EmptyAssignedUnits switchToExploreActivityPacks='/teachers/classrooms/lesson_planner#/tab/featured-activity-packs' />
      }}, this);
		return (
			<span>{units}</span>
		);
	}

});
