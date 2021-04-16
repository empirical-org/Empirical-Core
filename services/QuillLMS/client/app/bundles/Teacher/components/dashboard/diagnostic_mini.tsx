import * as React from 'react';
import _ from 'underscore';

import { DataTable, helpIcon, fileChartIcon, expandIcon, } from '../../../Shared/index'
import { requestGet } from '../../../../modules/request/index.js';

const INITIAL_MAX = 5

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
  showAll: boolean;
}

const headers = [
  {
    name: 'Diagnostic',
    attribute: 'diagnostic',
    width: '230px'
  },
  {
    name: 'Class',
    attribute: 'class',
    width: '180px'
  },
  {
    name: 'Completed',
    attribute: 'completed',
    width: '62px',
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

const MobileRecommendationRow = ({ row, }) => {
  const {
    diagnostic,
    recommendationsHref,
  } = row
  return (<div className="mobile-data-row">
    <div className="top-row">
      <span>{diagnostic}</span>
      <a className="focus-on-light" href={recommendationsHref}>View</a>
    </div>
  </div>)
}

const DiagnosticMini = ({passedDiagnostics, onMobile, }) => {
  const [loading, setLoading] = React.useState<DiagnosticMiniState>(!passedDiagnostics);
  const [diagnostics, setDiagnostics] = React.useState<DiagnosticMiniState>(passedDiagnostics || []);
  const [showAll, setShowAll] = React.useState<DiagnosticMiniState>(false);

  React.useEffect(() => {
    getDiagnostics();
  }, []);

  function getDiagnostics() {
    requestGet('/teachers/diagnostic_info_for_dashboard_mini',
      (data) => {
        setDiagnostics(data.units);
        setLoading(false)
      }
    )
  }

  function handleShowMoreClick() { setShowAll(true) }

  if (loading || !diagnostics.length) { return <span /> }

  const rows = diagnostics.slice(0, showAll ? diagnostics.length : INITIAL_MAX).map(diagnostic => {
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
      recommendations: <a className="focus-on-light" href={recommendationsHref}><img alt={fileChartIcon.alt} src={fileChartIcon.src} /><span>View</span></a>,
      recommendationsHref,
    }
  })

  const dataDisplay = onMobile ? rows.map(r => <MobileRecommendationRow key={r.id} row={r} />) : <DataTable headers={headers} rows={rows} />

  return (<section className="diagnostic-mini">
    <header>
      <h2>
        <span>Diagnostic </span>
        <span className="no-break">
          <span>recommendations</span>
          <a className="focus-on-light" href="https://app.intercom.com/a/apps/v2ms5bl3/articles/articles/5014101/show"><img alt={helpIcon.alt} src={helpIcon.src} /></a>
        </span>
      </h2>
    </header>
    {dataDisplay}
    {diagnostics.length > INITIAL_MAX && !showAll && <button className="bottom-button focus-on-light interactive-wrapper" onClick={handleShowMoreClick} type="button">Show more <img alt={expandIcon.alt} src={expandIcon.src} /></button>}
  </section>)
}

export default DiagnosticMini
