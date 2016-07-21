'use strict'

 import React from 'react'
  import _ from 'underscore'
 import ActivitySearchSort from './activity_search_sort'

 export default React.createClass({


	render: function () {
		var sorts = _.map(this.props.sorts, function (sort) {
			return <ActivitySearchSort key={sort.alias} updateSort={this.props.updateSort} data={sort} />
		}, this);


		return (
			<tr>
				<th className="scorebook-icon-check">

				</th>
				{sorts}


			</tr>
		);
	}
});
