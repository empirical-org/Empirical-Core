EC.Units = React.createClass({
	render: function () {
		var units = _.map(this.props.data, function (data) {
			return (<EC.Unit
							key={data.unit.id}
							updateDueDate={this.props.updateDueDate}
							hideUnit={this.props.hideUnit}
							deleteClassroomActivity={this.props.deleteClassroomActivity}
							data={data} />);
		}, this);

		return (
			<span>
				{units}
			</span>
		);
	}

});