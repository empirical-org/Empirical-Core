EC.Units = React.createClass({








	render: function () {
		units = _.map(this.props.data, function (data) {
			return (<EC.Unit deleteUnit={this.props.deleteUnit} data={data} />)
		}, this);

		return (
			<span>
				{units}
			</span>
		);

	}


});