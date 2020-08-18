import * as React from 'react'
import LoadingSpinner from '../../shared/loading_indicator.jsx'
import EmptyDiagnosticProgressReport from './empty_diagnostic_progress_report.jsx'
import $ from 'jquery'

export default class DiagnosticActivityPacks extends React.Component {
  constructor(props) {
		super(props)

		this.state = {
			units: [],
			loaded: false,
		}
	}

  componentDidMount(){
		$('.diagnostic-tab').addClass('active');
		$('.activity-analysis-tab').removeClass('active');

		this.getDiagnosticUnits()
		this.getDiagnosticStatus()
	}

  getDiagnosticUnits() {
    $.ajax({
      url: '/teachers/diagnostic_units',
      success: this.displayUnits,
      error() {alert('Unable to download your reports at this time.')}
    });
  }

  displayUnits = (data) => {
		this.setState({ units: this.parseUnits(data), loaded: true, });
	}

  parseUnits = (data) => {
    const units = []
    return []
  }

  stateBasedComponent() {
		const { loaded, units, } = this.state

    if (!loaded) { return (<LoadingSpinner />) }

		if (units.length === 0) { return (<EmptyDiagnosticProgressReport />) }

		return (
      <div className="activity-analysis">
        <h1>Diagnostic Analysis</h1>
        <p>Open a diagnostic report to view student&#39; responses, the overall results on each question, and the individualized recommendations for each student.</p>
      </div>
		)
	}

  PARSE

  render() {
		return (
      <div className="container manage-units">
        {this.stateBasedComponent()}
      </div>
		)
	}
}
