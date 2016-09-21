import React from 'react'
import Units from '../../lesson_planner/manage_units/units.jsx'
import $ from 'jquery'

'use strict'

export default React.createClass({

	getInitialState: function() {
		return {units: [], loaded: false}
	},

	componentDidMount: function() {
		$.ajax({url: '/teachers/units', data: {report: true}, success: this.displayUnits, error: function() {alert('Unable to download your reports at this time.')}});
	},

	displayUnits: function(data) {
		this.setState({units: data.units, loaded: true});
	},

	stateBasedComponent: function() {
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
				<div>
					<h2>Activity Analysis</h2>
					<p>Open an activity analysis to view the student responses, the overall results on each question, and the concepts students need practice for each concept.</p>
					<Units report={Boolean(true)} data={this.state.units}/>
				</div>
			);
		}
	},

	render: function() {

		return (
			<div className="container manage-units">
				{this.stateBasedComponent()}
			</div>
		);

	}

});
