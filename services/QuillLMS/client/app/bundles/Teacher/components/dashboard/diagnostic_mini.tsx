import * as React from 'react';
import _ from 'underscore';

import { DataTable } from 'quill-component-library/dist/componentLibrary'

import { requestGet } from '../../../../modules/request/index.js';

interface Diagnostic {
  classroom_name: string,
  activity_name: string,
  activity_id: number,
  unit_id: number,
  classroom_id: number,
  completed_count: number,
  assigned_count: number
}

interface DiagnosticMiniState {
  loading: boolean;
  diagnostics: Array<Diagnostic>;
}

const headers = [
  {
    name: 'Diagnostic',
    attribute: 'diagnostic',
    width: '186px'
  },
  {
    name: 'Class',
    attribute: 'class',
    width: '186px'
  },
  {
    name: 'Completed',
    attribute: 'completed',
    width: '61px',
    rowSectionClassName: "completed-row-section"
  },
  {
    name: 'Recommendations',
    attribute: 'recommendations',
    width: '104px',
    noTooltip: true,
    rowSectionClassName: "recommendations-row-section",
    headerClassName: 'recommendations-header'
  }
]

const assignDiagnosticMini = () => {
  return (
    <div className="mini_container results-overview-mini-container col-md-4 col-sm-5 text-center">
      <div className="mini_content diagnostic-mini assign-diagnostic">
        <div className="gray-underline">
          <h3>Assign a Diagnostic</h3>
        </div>

        <img alt="" src={`${process.env.CDN_URL}/images/shared/new_diagnostic.svg`} />
        <p>See which skills students need to work on and get recommended learning&nbsp;plans.</p>
        <a className="bg-quillgreen text-white" href='/assign/diagnostic'>Assign Diagnostic</a>
      </div>
    </div>
  );
}

const generateRows = (diagnostics) => {
  return diagnostics.map(diagnostic => {
    const {
      classroom_name,
      activity_name,
      activity_id,
      unit_id,
      classroom_id,
      completed_count,
      assigned_count,
    } = diagnostic
    const recommendationsHref = `/teachers/progress_reports/diagnostic_reports#/u/${unit_id}/a/${activity_id}/c/${classroom_id}/recommendations`
    return {
      id: `${activity_id}-${classroom_id}-${unit_id}`,
      class: classroom_name,
      diagnostic: activity_name,
      completed: `${completed_count} of ${assigned_count}`,
      recommendations: completed_count ? <a className="quill-button fun primary outlined" href={recommendationsHref}>View</a> : null
    }
  })
}

const DiagnosticMini = ({passedDiagnostics}) => {
  const [loading, setLoading] = React.useState<DiagnosticMiniState>(!passedDiagnostics);
  const [diagnostics, setDiagnostics] = React.useState<DiagnosticMiniState>(passedDiagnostics || []);

  React.useEffect(() => {
    getDiagnostics();
  }, []);

  const getDiagnostics = () => {
    requestGet('/teachers/diagnostic_info_for_dashboard_mini',
      (data) => {
        setDiagnostics(data.units);
        setLoading(false)
      }
    )
  }

  if (loading) { return <span /> }
  if (!loading && !diagnostics.length) { return assignDiagnosticMini() }

  return (<section className="mini_container results-overview-mini-container col-md-8 col-sm-10 text-center" id="recently-assigned-diagnostics-card">
    <section className="inner-container">
      <header className="header-container flex-row space-between vertically-centered">
        <h3>Recently Assigned Diagnostics</h3>
        <a href="/teachers/progress_reports/diagnostic_reports/#/diagnostics">View All {diagnostics.length > 1 ? diagnostics.length : ''} Diagnostic Reports</a>
      </header>
      <DataTable
        headers={headers}
        rows={generateRows(diagnostics)}
      />
    </section>
  </section>)

}

export default DiagnosticMini
