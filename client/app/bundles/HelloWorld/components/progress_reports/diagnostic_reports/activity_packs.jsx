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

	switchToExploreActivityPacks: function(){
		window.location.href = '/teachers/classrooms/lesson_planner?tab=exploreActivityPacks';
	},

	stateBasedComponent: function() {
		if (this.state.units.length === 0 && this.state.loaded) {
			return (
				<div className="row empty-unit-manager">
					<div className="col-xs-7">
						<p>Welcome! This is where you'll be able to see reports detailing your students' answers, but they haven't completed any activities yet.</p>
						<p>Let's add your first activity from the Featured Activity Pack library.</p>
					</div>
					<div className="col-xs-4">
						<button onClick={this.switchToExploreActivityPacks} className="button-green create-unit featured-button">Browse Featured Activity Packs</button>
					</div>
				</div>
			);
		} else {
			return (
				<div className='activity-analysis'>
					<h1>Activity Analysis</h1>
					<p>Open an activity analysis to view students' responses, the overall results on each question, and the concepts students need practice for each concept.</p>
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
