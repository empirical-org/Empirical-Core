'use strict'

 import React from 'react'
  import _ from 'underscore'

 export default  React.createClass({


	clickOption: function () {
		this.props.selectFilterOption(this.props.data.id)
	},

	render: function () {
		return (
			<li onClick={this.clickOption}>
				<span className="filter_option">
					{this.props.data.name}
				</span>
			</li>
		);
	}

});
