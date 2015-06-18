EC.ActivitySearchFilters = React.createClass({
	render: function () {
		filters = _.map(this.props.data, function (filter) {
			return <EC.ActivitySearchFilter selectFilterOption = {this.props.selectFilterOption} data={filter}/>
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

