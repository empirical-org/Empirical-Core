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
/*
<thead>
	<tr>
		<th>
			<%= image_tag 'scorebook/icon-check.png' %>
		</th>
		<th id='activity_classification' class='sorter'>App<i class="fa fa-caret-up"></i></th>
		<th id='activity' class='sorter'>Activity<i class="fa fa-caret-up"></i></th>
		<th id='section' class='sorter'>Standard Level<i class="fa fa-caret-up"></i></th>
		<th id='topic' class='sorter active'>Concept<i class="fa fa-caret-up"></i></th>
	</tr>
</thead>
*/