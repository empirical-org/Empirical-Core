EC.ActivitySearchResults = React.createClass({
	


	render: function () {
		rows = _.map(this.props.currentPageSearchResults, function (ele) {
			var selected = _.include(this.props.selectedActivities, ele)
			
			return <EC.ActivitySearchResult data={ele} selected={selected} toggleActivitySelection={this.props.toggleActivitySelection} />
		}, this);
		return (
			<tbody>
				{rows}
			</tbody>
		);
	}


});