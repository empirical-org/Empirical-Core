EC.ActivitySearchResults = React.createClass({
	render: function () {
		rows = _.map(this.props.currentPageSearchResults, function (ele) {
			var selectedIds = _.pluck(this.props.selectedActivities, 'id')
			var selected = _.include(selectedIds, ele.id)
			console.log('selected', selected)
			return <EC.ActivitySearchResult key={ele.id} data={ele} selected={selected} toggleActivitySelection={this.props.toggleActivitySelection} />
		}, this);
		return (
			<tbody>
				{rows}
			</tbody>
		);
	}
});