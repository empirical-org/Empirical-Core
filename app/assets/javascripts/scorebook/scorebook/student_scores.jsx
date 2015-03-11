EC.StudentScores = React.createClass({

	icon_row: function (data) {
		var row = _.map(data, function (ele) {
			return (
				<EC.ActivityIconWithTooltip data={ele} />
			);
		});
		return row;
	},


	render: function () {
		var z = _.sortBy(this.props.data.results, function (ele) {
			return (1 - ele.percentage)
		});

		this.props.data.results = z


		var n = 10
		var x = _.chain(this.props.data.results).groupBy(function (element, index) {
			return Math.floor(index/n)
		}).toArray().value()

		var icon_rows = _.map(x, function (ele) {
			return (
				<div className="icon-row">
					{this.icon_row(ele)}
				</div>
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
})



