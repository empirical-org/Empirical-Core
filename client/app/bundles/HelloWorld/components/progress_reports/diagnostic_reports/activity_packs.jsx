import React from 'react'
import Units  from '../../lesson_planner/manage_units/units.jsx'
import $ from 'jquery'

'use strict'

export default React.createClass({

	getInitialState: function() {
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
					<button onClick={this.switchToCreateUnit} className="button-green create-unit">Assign A New Activity</button>
				</div>
				<Units data={this.state.units}/>
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
