'use strict'

 import React from 'react'

 export default  React.createClass({


	clickOption: function () {
		this.props.selectFilterOption(this.props.data.id)
	},

	render: function () {
		var name = this.props.data.alias ? this.props.data.alias : this.props.data.name;
		return (
			<li onClick={this.clickOption}>
				<span className="filter_option">
					{name}
				</span>
			</li>
		);
	}

});
