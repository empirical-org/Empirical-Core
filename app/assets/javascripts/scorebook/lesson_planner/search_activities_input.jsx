EC.SearchActivitiesInput = React.createClass({

	newSearchQuery: function () {
		console.log('new search query')
		newQuery = $('#search_activities_input').val();
		this.props.updateSearchQuery(newQuery);
	},

	render: function () {
		return (
			<span>
				<input id="search_activities_input" type="text" placeholder="Select Activities" />
				<button onClick={this.newSearchQuery} id="search_activities_button" className="button-gray">Search</button>
			</span>
		);
	}

});

				
