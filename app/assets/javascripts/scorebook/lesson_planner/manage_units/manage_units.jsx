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
	deleteClassroomActivity: function (ca_id, unit_id) {


		var units = this.state.units;
		var x1 = _.map(units, function (unit) {
			if (unit.unit.id === unit_id) {
				console.log('found unit')
				unit.classroom_activities = _.reject(unit.classroom_activities, function (ca) {
					return ca.id === ca_id
				});
			}
			return unit
		});
		this.setState({units: x1})

		$.ajax({
			type: "delete",
			url: "/teachers/classroom_activities/" + ca_id,
			success: function () {
				console.log('delete ca success')
			},
			error: function () {
				console.log('delete ca errors')
			}
		})
	},
	updateDueDate: function (ca_id, date) {
		console.log('update due date', ca_id + ' ' + date)
		$.ajax({
			type: "put",
			data: {due_date: date},
			url: "/teachers/classroom_activities/" + ca_id,
			success: function () {
				console.log('update due date success')
			},
			error: function () {
				console.log('update due date error')
			}

		})
	},

	render: function () {
		return (
			<div className="container manage-units">
				<section >
					
				</section>
				<EC.Units updateDueDate={this.updateDueDate} deleteClassroomActivity={this.deleteClassroomActivity}   deleteUnit={this.deleteUnit} data={this.state.units} />
			</div>
		);

	}


});