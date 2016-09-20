'use strict'

 import React from 'react'
 import _ from 'underscore'
	import Unit from './unit'

 export default React.createClass({
	render: function () {
		var units = _.map(this.props.data, function (data) {
			return (<Unit   key={data.unit.id}
              deleteClassroomActivity={this.props.deleteClassroomActivity}
              hideUnit={this.props.hideUnit}
              report={this.props.report}
							data={data}
              />);
		}, this);

		return (
			<span>
				{units}
			</span>
		);
	}

});
