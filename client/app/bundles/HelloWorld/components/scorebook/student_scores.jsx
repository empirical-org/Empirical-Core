"use strict";
import _ from 'underscore'
import IconRow from './icon_row.jsx'
import React from 'react'

export default React.createClass({
	propTypes: {
		data: React.PropTypes.object.isRequired,
		premium_state: React.PropTypes.string.isRequired
	},

	render: function () {
		var n = 10;
		var x = _.chain(this.props.data.results).groupBy(function (element, index) {
			return Math.floor(index/n);
		}).toArray().value();
		var icon_rows = _.map(x, function (ele, i) {
			return (
				<IconRow key={'icon-row-' + ele[0].id + '-' + ele[ele.length-1].id} data={ele} premium_state={this.props.premium_state} />
			);
		}, this);
		return (
			<div className='container'>
				<section>
					<h3 className="student-name">{this.props.data.user.name}</h3>
					<div className="row">
					 	<div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
					 		{icon_rows}
					 	</div>
					</div>
				</section>
			</div>
		);
	}
});
