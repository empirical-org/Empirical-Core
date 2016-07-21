'use strict'

 import React from 'react'
 import _ from 'underscore'
	import Unit from './unit'

 export default React.createClass({
	render: function () {
		var units = _.map(this.props.data, function (data) {
			return (<Unit
							key={data.unit.id}
							updateDueDate={this.props.updateDueDate}
							hideUnit={this.props.hideUnit}
							editUnit={this.props.editUnit}
							deleteClassroomActivity={this.props.deleteClassroomActivity}
							data={data} />);
		}, this);

		return (
			<span>
				{units}
			</span>
		);
	}

});
