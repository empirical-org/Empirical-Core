'use strict'

 import React from 'react'

 export default React.createClass({

	clickSort: function () {
		var new_asc_or_desc;
		if (this.props.data.asc_or_desc == 'desc') {
			new_asc_or_desc = 'asc';
		} else {
			new_asc_or_desc = 'desc';
		}
		this.props.updateSort(this.props.data.field, new_asc_or_desc);

	},

	render: function () {
		var arrowClass;
		if (this.props.data.asc_or_desc == 'desc') {
			arrowClass = 'fa fa-caret-down';
		} else {
			arrowClass = 'fa fa-caret-up'
		}


		return (
			<th className="sorter" onClick={this.clickSort}>
				{this.props.data.alias}
				<i className={arrowClass}></i>
			</th>
		);
	}
});
