'use strict'

 import React from 'react'
import createReactClass from 'create-react-class'
  import _ from 'underscore'

 export default  createReactClass({


	clickOption: function () {
		this.props.selectFilterOption(this.props.data.id)
	},

	render: function () {
		return (
			<li onClick={this.clickOption}>
				<span className="filter_option">
					{this.props.data.alias || this.props.data.name}
				</span>
			</li>
		);
	}

});
