EC.Unit = React.createClass({

	deleteUnit: function () {
		var x = confirm("Are you sure you want to delete this Unit? It will delete all assignments given to students associated with this unit, even if those assignments have already been completed.");
		if (x) {
			this.props.deleteUnit(this.props.data.unit.id);
		}
	},

	render: function () {
		var studentNoun, classroomActivities;
		if (this.props.data.num_students_assigned === 1) {
			studentNoun = " Student";
		} else {
			studentNoun = " Students";
		}

		classroomActivities = _.map(this.props.data.classroom_activities, function (ca) {
			return (<EC.ClassroomActivity 
							updateDueDate={this.props.updateDueDate} 
							deleteClassroomActivity={this.props.deleteClassroomActivity} 
							data={ca} />);
		}, this);

		return (
			<section >
				<div className="row vertical-align">
					<h3 className="col-md-10 vcenter">{this.props.data.unit.name}</h3>
					<div className="col-md-2 vcenter pull-right delete-unit" onClick={this.deleteUnit}>Delete Unit</div>
				</div>
				<div className="unit-label">
					{"Assigned to "  + this.props.data.num_students_assigned + studentNoun}
				</div>
				<div className="table">
					{classroomActivities}
				</div>
			</section>
		);
	}

});