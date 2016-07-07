'use strict'

 import React from 'react'
 import ActivitySearchFilter from './activity_search_filter'
 import _ from 'underscore'

 export default  React.createClass({
	render: function () {
		var filters = _.map(this.props.data, function (filter) {
			return <ActivitySearchFilter key={filter.alias} selectFilterOption = {this.props.selectFilterOption} data={filter}/>
		}, this);

		return (
			<div className="row activity-page-dropdown-wrapper">
				<div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
					{filters}
				</div>
			</div>
		);
	}
});
