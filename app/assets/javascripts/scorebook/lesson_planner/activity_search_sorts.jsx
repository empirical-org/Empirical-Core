EC.ActivitySearchSorts = React.createClass({


	render: function () {
		sorts = _.map(this.props.sorts, function (sort) {
			return <EC.ActivitySearchSort updateSort={this.props.updateSort} data={sort} />
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
