'use strict'

 import React from 'react'
 import _ from 'underscore'
 import Unit from './unit'
 import ClassroomsWithStudentsContainer from '../../../containers/ClassroomsWithStudentsContainer.jsx'

 export default React.createClass({
	render: function () {
		var units = _.map(this.props.data, function (data) {
			return (<Unit   key={data.unit.id}
              deleteClassroomActivity={this.props.deleteClassroomActivity}
              hideUnit={this.props.hideUnit}
              report={this.props.report}
              updateDueDate={this.props.updateDueDate}
							data={data}
              />);
		}, this);
		return (
			<span>
        <ClassroomsWithStudentsContainer/>
				{units}
			</span>
		);
	}

});
