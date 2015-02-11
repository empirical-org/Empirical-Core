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
			}

		});
	},
	displayUnits: function (data) {
		this.setState({units: data.units});
	},
	deleteUnit: function (id) {
		var units, x1;
		units = this.state.units;
		x1 = _.reject(units, function (unit) {
			return unit.unit.id == id;
		})
		this.setState({units: x1});

		$.ajax({
			type: "delete",
			url: "/teachers/units/" + id,
			success: function () {
			},
			error: function () {
			}
		});
	},
	deleteClassroomActivity: function (ca_id, unit_id) {
		var units, x1;
		units = this.state.units;
		x1 = _.map(units, function (unit) {
			if (unit.unit.id === unit_id) {
				unit.classroom_activities = _.reject(unit.classroom_activities, function (ca) {
					return ca.id === ca_id;
				});
			}
			return unit;
		});
		this.setState({units: x1});

		$.ajax({
			type: "delete",
			url: "/teachers/classroom_activities/" + ca_id,
			success: function () {
			},
			error: function () {
			}
		});
	},
	updateDueDate: function (ca_id, date) {
		$.ajax({
			type: "put",
			data: {due_date: date},
			url: "/teachers/classroom_activities/" + ca_id,
			success: function () {
			},
			error: function () {
			}

		});
	},
	switchToCreateUnit: function () {
		this.props.toggleTab('createUnit');
	},

	render: function () {
		return (
			<div className="container manage-units">
				<div  className= "create-unit-button-container">
					<button onClick={this.switchToCreateUnit} className="button-green create-unit">Create a New Unit</button>
				</div>
				<EC.Units 
					updateDueDate={this.updateDueDate}
					deleteClassroomActivity={this.deleteClassroomActivity}
					deleteUnit={this.deleteUnit} data={this.state.units} />
			</div>
		);

	}


});