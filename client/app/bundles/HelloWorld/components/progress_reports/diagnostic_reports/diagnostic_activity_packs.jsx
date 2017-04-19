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
		$('.diagnostic-tab').addClass('active');
		$('.activity-analysis-tab').removeClass('active');
	},

	componentDidMount: function() {
    this.getDiagnosticUnits()
	},

  getDiagnosticUnits: function() {
    $.ajax({
      url: '/teachers/diagnostic_units',
      data: {report: true},
      success: this.displayUnits,
      error: function() {alert('Unable to download your reports at this time.')}
    });
  },

	displayUnits: function(data) {
		this.setState({units: data.units, loaded: true});
	},

	stateBasedComponent: function() {
		if (this.state.loaded) {
			if (this.state.units.length === 0) {
				return (
					<EmptyProgressReport missing='diagnosticActivities'/>
				);
			} else if (this.state.units.length === 1) {
        const ca = this.state.units[0].classroom_activities[0]
        window.location = `/teachers/progress_reports/diagnostic_reports#/u/${ca.unit_id}/a/${ca.activity_id}/c/${ca.classroom_id}/students`
      } else {
				return (
					<div className='activity-analysis'>
						<h1>Diagnostic Analysis</h1>
						<p>Open a diagnostic report to view students' responses, the overall results on each question, and the individualized recommendations for each student.</p>
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
