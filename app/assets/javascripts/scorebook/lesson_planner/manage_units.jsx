EC.ManageUnits = React.createClass({


	getInitialState: function () {
		return {
			units: []
		}
	},

	componentDidMount: function () {
		$.ajax({
			url: '/teachers/units',
			data: {},
			success: this.displayUnits,
			error: function () {
				console.log('error loading units');
			}

		});
	},
	displayUnits: function (data) {
		console.log(data)
		this.setState({units: data.units});
	},
	deleteUnit: function (id) {
		console.log('delete unit main')
		var units = this.state.units
		var x1 = _.reject(units, function (unit) {
			return unit.unit.id == id
		})
		this.setState({units: x1})

		$.ajax({
			type: "delete",
			url: "/teachers/units/" + id,
			success: function () {
				console.log('delete unit success')
			},
			error: function () {
				console.log('delete unit error')
			}
		})
	},


	render: function () {
		return (
			<div className="container manage-units">
				<EC.Units deleteUnit={this.deleteUnit} data={this.state.units} />
			</div>
		);

	}


});