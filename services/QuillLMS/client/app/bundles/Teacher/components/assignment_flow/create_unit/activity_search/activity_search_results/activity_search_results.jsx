'use strict'


 import React from 'react'
	import _ from 'underscore'
	import ActivitySearchResult from './activity_search_result'

 export default React.createClass({
	render: function () {
		var rows = _.map(this.props.currentPageSearchResults, function (ele) {
			var selectedIds = _.pluck(this.props.selectedActivities, 'id')
			var selected = _.include(selectedIds, ele.id)
			return <ActivitySearchResult data={ele} key={ele.id} selected={selected} toggleActivitySelection={this.props.toggleActivitySelection} />
		}, this);
		return (
  <tbody>
    {rows}
  </tbody>
		);
	}
});
