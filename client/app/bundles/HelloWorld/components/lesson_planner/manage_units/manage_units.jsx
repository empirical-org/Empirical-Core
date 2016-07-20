'use strict'

 import React from 'react'
 import $ from 'jquery'
 import Units from './units'

 export default React.createClass({


	getInitialState: function () {
		return {
			units: [],
			loaded: false
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
			type: "put",
			url: "/teachers/units/" + id + "/hide",
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
		this.props.actions.toggleTab('createUnit');
	},

	switchToExploreActivityPacks: function () {
		this.props.actions.toggleTab('exploreActivityPacks');
	},

	stateBasedComponent: function () {
		if (this.state.units.length === 0 && this.state.loaded) {
			return (
				<div className="row empty-unit-manager">
					<div className="col-xs-7">
						<p>Welcome! This is where your assigned activity packs are stored, but it's empty at the moment.</p>
						<p>Let's add your first activity from the Featured Activity Pack library.</p>
					</div>
					<div className="col-xs-4">
						<button onClick={this.switchToExploreActivityPacks} className="button-green create-unit featured-button">Browse Featured Activity Packs</button>
					</div>
				</div>
			);
		} else {
			return (
				<span>
				<div  className= "create-unit-button-container">
					<button onClick={this.switchToCreateUnit} className="button-green create-unit">Create Activity Pack</button>
				</div>
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
