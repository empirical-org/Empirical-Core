import React from 'react'
import Units from '../../assignment_flow/manage_units/units.jsx'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import EmptyDiagnosticProgressReport from './empty_diagnostic_progress_report.jsx'
import $ from 'jquery'

export default class DiagnosticActivityPacks extends React.Component {
    constructor(props) {
		super(props)

		this.state = {
			units: [],
			loaded: false,
			diagnosticStatus: ''
		}
	}

  componentDidMount(){
		$('.diagnostic-tab').addClass('active');
		$('.activity-analysis-tab').removeClass('active');

		this.getDiagnosticUnits()
		this.getDiagnosticStatus()
	}

  getDiagnosticStatus = () => {
		$.ajax({
			url: '/teachers/progress_reports/diagnostic_status',
			success: data => { this.setState({diagnosticStatus: data.diagnosticStatus })},
		});
	}

  getDiagnosticUnits() {
      $.ajax({
        url: '/teachers/diagnostic_units',
        data: {report: true},
        success: this.displayUnits,
        error() {alert('Unable to download your reports at this time.')}
      });
    }

  displayUnits = (data) => {
		this.setState({units: this.parseUnits(data), loaded: true});
	}

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
			created_at: u.unit_activity_created_at,
			caId: u.classroom_activity_id,
			unitId: u.unit_id,
			activityClassificationId: u.activity_classification_id,
			ownedByCurrentUser: u.owned_by_current_user === 't',
			ownerName: u.owner_name,
			classroomId: u.classroom_id,
			dueDate: u.due_date, });
		return caObj;
	}

  goToDiagnosticReport() {
		const { units, } = this.state
		const unit = units.values().next().value;
		const ca = units.values().next().value.classroomActivities.values().next().value;
		window.location = `/teachers/progress_reports/diagnostic_reports#/u/${unit.unitId}/a/${ca.activityId}/c/${ca.classroomId}/students`
	}

  orderUnits(units) {
		const unitsArr = [];
		Object.keys(units).forEach(unitId => unitsArr.push(units[unitId]));
		return unitsArr;
	}

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
					uaId: u.unit_activity_id,
          cuId: u.classroom_unit_id,
					activityId: u.activity_id,
					unitId: u.unit_id,
					created_at: u.unit_activity_created_at,
					activityClassificationId: u.activity_classification_id,
					ownedByCurrentUser: u.owned_by_current_user === 't',
					ownerName: u.owner_name,
					classroomId: u.classroom_id,
					createdAt: u.ca_created_at,
					dueDate: u.due_date, });
			}
		});
		return this.orderUnits(parsedUnits);
	}

  stateBasedComponent() {
		const { loaded, units, diagnosticStatus, } = this.state

		if (loaded) {
			if (units.length === 0) {
				return (<EmptyDiagnosticProgressReport status={diagnosticStatus} />);
			} else {
				return (
  <div className="activity-analysis">
    <h1>Diagnostic Analysis</h1>
    <p>Open a diagnostic report to view student&#39; responses, the overall results on each question, and the individualized recommendations for each student.</p>
    <Units data={units} report={Boolean(true)} />
  </div>
				)
			}
		}

		return (<LoadingSpinner />)
	}

  render() {
		return (
  <div className="container manage-units">
    {this.stateBasedComponent()}
    <div className="feedback-note">We would love to hear about your experience with our diagnostics. Please share your feedback by filling out this <a href="https://docs.google.com/forms/d/1iPmKjOO1KhvgF1tbj--kUVml40FSf-CTbRxcuYHij5Q/edit?usp=sharing" rel="noopener noreferrer" target="_blank">short feedback form</a>.</div>
  </div>
		)
	}
}
