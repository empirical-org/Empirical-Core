import * as React from 'react';

import { DataTable, expandIcon, fileChartIcon, helpIcon } from '../../../Shared/index';

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
    width: '290px'
  },
  {
    name: 'Class',
    attribute: 'classroom',
    width: '290px'
  },
  {
    name: 'Completed',
    attribute: 'completed',
    width: '62px',
    rowSectionClassName: "completed-row-section"
  },
  {
    name: 'Results',
    attribute: 'results',
    width: '62px',
    noTooltip: true,
    rowSectionClassName: "last-row-section",
    headerClassName: 'last-header'
  }
]

const MobileRecommendationRow = ({ row, }) => {
  const {
    diagnostic,
    summaryHref,
    classroom,
  } = row
  return (
    <div className="mobile-data-row">
      <div className="top-row">
        <span>{diagnostic}</span>
        <a className="focus-on-light" href={summaryHref}>View</a>
      </div>
      <div>{classroom}</div>
    </div>
  )
}

const DiagnosticMini = ({diagnostics, onMobile, }) => {
  const [showAll, setShowAll] = React.useState<DiagnosticMiniState>(false);

  function handleShowMoreClick() { setShowAll(true) }

  if (!diagnostics.length) { return <span /> }

  const rows = diagnostics.slice(0, showAll ? diagnostics.length : INITIAL_MAX).map(diagnostic => {
    const {
      classroom_name,
      activity_name,
      activity_id,
      unit_id,
      classroom_id,
      completed_count,
      assigned_count,
      pre_test_id,
      post_test_id
    } = diagnostic
    const unitQueryString = pre_test_id || post_test_id ? '' : `?unit=${unit_id}` // for pre-tests that have post-tests and post-tests, we aggregate all the results for a classroom rather than breaking it down by unit
    const summaryOrGrowthSummary = pre_test_id ? 'growth_summary' : 'summary'
    const summaryHref = `/teachers/progress_reports/diagnostic_reports#diagnostics/${activity_id}/classroom/${classroom_id}/${summaryOrGrowthSummary}${unitQueryString}`
    return {
      id: `${activity_id}-${classroom_id}-${unit_id}`,
      classroom: classroom_name,
      diagnostic: activity_name,
      completed: `${completed_count} of ${assigned_count}`,
      results: <a className="focus-on-light" href={summaryHref}><img alt={fileChartIcon.alt} src={fileChartIcon.src} /><span>View</span></a>,
      summaryHref,
    }
  })

  const dataDisplay = onMobile ? rows.map(r => <MobileRecommendationRow key={r.id} row={r} />) : <DataTable headers={headers} rows={rows} />

  return (
    <section className="diagnostic-mini">
      <header>
        <h2>
          <span>Diagnostic </span>
          <span className="no-break">
            <span>results</span>
            <a className="focus-on-light" href="https://support.quill.org/en/articles/5014101-how-does-the-diagnostic-recommendations-section-on-the-teacher-home-page-work" rel="noopener noreferrer" target="_blank"><img alt={helpIcon.alt} src={helpIcon.src} /></a>
          </span>
        </h2>
      </header>
      {dataDisplay}
      {diagnostics.length > INITIAL_MAX && !showAll && <button className="bottom-button focus-on-light interactive-wrapper" onClick={handleShowMoreClick} type="button">Show more <img alt={expandIcon.alt} src={expandIcon.src} /></button>}
    </section>
  )
}

export default DiagnosticMini
