import React from 'react'
import Units from '../../lesson_planner/manage_units/units.jsx'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import EmptyProgressReport from '../../scorebook/EmptyProgressReport.jsx'
import $ from 'jquery'

'use strict'

export default React.createClass({

	getInitialState: function() {
		return {units: [], loaded: false}
	},

	componentWillMount(){
		$('.diagnostic-tab').removeClass('active');
		$('.activity-analysis-tab').addClass('active');
	},

	componentDidMount: function() {
		$.ajax({url: '/teachers/units', data: {report: true}, success: this.displayUnits, error: function() {alert('Unable to download your reports at this time.')}});
	},

	displayUnits: function(data) {
		this.setState({units: data.units, loaded: true});
	},

	switchToExploreActivityPacks: function(){
		window.location.href = '/teachers/classrooms/activity_planner?tab=exploreActivityPacks';
	},

	stateBasedComponent: function() {
		if (this.state.loaded) {
			if (this.state.units.length === 0) {
				return (
					<EmptyProgressReport missing='activities'/>
				);
			} else {
				return (
					<div className='activity-analysis'>
						<h1>Activity Analysis</h1>
						<p>Open an activity analysis to view students' responses, the overall results on each question, and the concepts students need to practice.</p>
						<Units report={Boolean(true)} data={this.state.units}/>
					</div>
				);
			}
		} else {
			return (
			<LoadingSpinner />
			)
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
