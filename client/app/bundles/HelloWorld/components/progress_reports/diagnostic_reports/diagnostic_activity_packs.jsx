import React from 'react'
import Units from '../../lesson_planner/manage_units/units.jsx'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import EmptyDiagnosticProgressReport from './empty_diagnostic_progress_report.jsx'
import $ from 'jquery'

'use strict'

export default React.createClass({

	getInitialState: function() {
		return {units: [], loaded: false, diagnosticStatus: ''}
	},

	componentWillMount(){
		$('.diagnostic-tab').addClass('active');
		$('.activity-analysis-tab').removeClass('active');
	},

	componentDidMount: function() {
    this.getDiagnosticUnits()
		this.getDiagnosticStatus()
	},

  getDiagnosticUnits: function() {
    $.ajax({
      url: '/teachers/diagnostic_units',
      data: {report: true},
      success: this.displayUnits,
      error: function() {alert('Unable to download your reports at this time.')}
    });
  },

	getDiagnosticStatus: function() {
		$.ajax({
			url: '/teachers/progress_reports/diagnostic_status',
			success: data => {this.setState({diagnosticStatus: data.diagnosticStatus})},
		});
	},

	displayUnits: function(data) {
		this.setState({units: this.parseUnits(data), loaded: true});
	},

	goToDiagnosticReport: function() {
		const unit = this.state.units.values().next().value;
		const ca = this.state.units.values().next().value.classroomActivities.values().next().value;
		window.location = `/teachers/progress_reports/diagnostic_reports#/u/${unit.unitId}/a/${ca.activityId}/c/${ca.classroomId}/students`
	},

	generateNewCaUnit(u) {
		const caObj = {
			studentCount: Number(u.array_length ? u.array_length : u.class_size),
			classrooms: new Set([u.class_name]),
			classroomActivities: new Map(),
			unitId: u.unit_id,
			unitCreated: u.unit_created_at,
			unitName: u.unit_name,
		};
		caObj.classroomActivities.set(u.activity_id, {
			name: u.activity_name,
			activityId: u.activity_id,
			created_at: u.classroom_activity_created_at,
			caId: u.classroom_activity_id,
			unitId: u.unit_id,
			activityClassificationId: u.activity_classification_id,
			ownedByCurrentUser: u.owned_by_current_user === 't',
			ownerName: u.owner_name,
			classroomId: u.classroom_id,
			dueDate: u.due_date, });
		return caObj;
	},

	parseUnits(data) {
		const parsedUnits = {};
		data.forEach((u) => {
			if (!parsedUnits[u.unit_id]) {
				// if this unit doesn't exist yet, go create it with the info from the first ca
				parsedUnits[u.unit_id] = this.generateNewCaUnit(u);
			} else {
				const caUnit = parsedUnits[u.unit_id];
				if (!caUnit.classrooms.has(u.class_name)) {
					// add the info and student count from the classroom if it hasn't already been done
					caUnit.classrooms.add(u.class_name);
					caUnit.studentCount += Number(u.array_length ? u.array_length : u.class_size);
				}
				// add the activity info if it doesn't exist
				caUnit.classroomActivities.set(u.activity_id,
					caUnit.classroomActivities[u.activity_id] || {
					name: u.activity_name,
					caId: u.classroom_activity_id,
					activityId: u.activity_id,
					unitId: u.unit_id,
					created_at: u.classroom_activity_created_at,
					activityClassificationId: u.activity_classification_id,
					ownedByCurrentUser: u.owned_by_current_user === 't',
					ownerName: u.owner_name,
					classroomId: u.classroom_id,
					createdAt: u.ca_created_at,
					dueDate: u.due_date, });
			}
		});
		return this.orderUnits(parsedUnits);
	},

	orderUnits(units) {
		const unitsArr = [];
		Object.keys(units).forEach(unitId => unitsArr.push(units[unitId]));
		return unitsArr;
	},

	stateBasedComponent: function() {
		if (this.state.loaded) {
			if (this.state.units.length === 0) {
				return (
					<EmptyDiagnosticProgressReport status={this.state.diagnosticStatus}/>
				);
			} else if (this.state.units.length === 1) {
				this.goToDiagnosticReport()
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
