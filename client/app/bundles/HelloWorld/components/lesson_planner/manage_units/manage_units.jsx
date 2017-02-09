'use strict'

 import React from 'react'
 import $ from 'jquery'
 import Units from './units'
 import EmptyAssignedUnits from './EmptyAssignedUnits.jsx'

 export default React.createClass({

	getInitialState: function () {
		return {
			units: [],
			loaded: false
		}
	},

	componentWillMount: function () {
		$.ajax({
			url: '/teachers/units',
			data: {},
			success: this.displayUnits,
			error: function () {
			}
		});
	},

	displayUnits: function (data) {
		this.setState({units: data.units,
									 loaded: true});
	},
	hideUnit: function (id) {
		var units, x1;
		units = this.state.units;
		x1 = _.reject(units, function (unit) {
			return unit.unit.id == id;
		})
		this.setState({units: x1});

		$.ajax({
			type: 'put',
			url: '/teachers/units/' + id + '/hide',
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
			type: 'delete',
			url: '/teachers/classroom_activities/' + ca_id,
			success: function () {
			},
			error: function () {
			}
		});
	},

	updateDueDate: function (ca_id, date) {
		$.ajax({
			type: 'put',
      dataType: 'json',
			data: {classroom_activity: {due_date: date}},
			url: '/teachers/classroom_activities/' + ca_id,
			success: function () {
			},
			error: function () {
			}

		});
	},

	switchToCreateUnit: function () {
		this.props.actions.toggleTab('createUnit');
	},

	stateBasedComponent: function () {
		if (this.state.units.length === 0 && this.state.loaded) {
      return <EmptyAssignedUnits/>
		} else {
			return (
				<span>
				{/* TODO: fix this so it links to the activity type selection page
          <div  className= "create-unit-button-container">
					<button onClick={this.switchToCreateUnit} className="button-green create-unit">Assign A New Activity</button>
				</div>*/}
				<Units
					updateDueDate={this.updateDueDate}
					editUnit={this.props.actions.editUnit}
					deleteClassroomActivity={this.deleteClassroomActivity}
					hideUnit={this.hideUnit} data={this.state.units} />
				</span>
			);
		}
	},

	render: function () {
		return (
			<div className="container manage-units">
				{this.stateBasedComponent()}
			</div>
		);

	}


});
