import * as React from 'react'
import $ from 'jquery'
import * as moment from 'moment'

import { DataTable } from 'quill-component-library/dist/componentLibrary'

import { requestGet } from '../../../../../modules/request/index';

import LoadingSpinner from '../../shared/loading_indicator.jsx'
import EmptyDiagnosticProgressReport from './empty_diagnostic_progress_report.jsx'

const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`

interface Assignment {
  classroom_name: string,
  activity_name: string,
  activity_id: number,
  unit_id: number,
  unit_name: string,
  classroom_id: number,
  completed_count: number,
  assigned_count: number,
  assigned_date: string
}

interface Diagnostic {
  name: string;
  id: string;
  individual_assignments: Array<Assignment>;
  classes_count: number;
  total_assigned: number;
  total_completed: number;
  last_assigned: string
}

interface DiagnosticActivityPacksState {
  loading: boolean;
  diagnostics: Array<Diagnostic>;
}

interface DiagnosticHeaderProps {
  diagnostic: Diagnostic,
  handleClickDiagnosticHeader: (event: any) => void;
}

const closedDiagnosticCardIdArray = () => {
  const closedDiagnosticCardIds = window.localStorage.getItem('closedDiagnosticCardIds')
  return closedDiagnosticCardIds ? closedDiagnosticCardIds.split(',') : []
}

const headers = [
  {
    name: 'Assigned date',
    attribute: 'assignedDate',
    width: '100px'
  },
  {
    name: 'Class',
    attribute: 'class',
    width: '215px'
  },
  {
    name: 'Activity pack',
    attribute: 'unitName',
    width: '215px'
  },
  {
    name: 'Completed',
    attribute: 'completed',
    width: '76px',
  },
  {
    name: 'Recommendations report',
    attribute: 'recommendations',
    width: '141px',
    rowSectionClassName: "recommendations-row-section",
    headerClassName: 'recommendations-header'
  }
]

const DiagnosticContent = ({ diagnostic, }: { diagnostic: Diagnostic }) => {
  const rows = diagnostic.individual_assignments.map(assignment => {
      const {
        classroom_name,
        activity_id,
        unit_id,
        unit_name,
        classroom_id,
        completed_count,
        assigned_count,
        assigned_date
      } = assignment
      const recommendationsHref = `/teachers/progress_reports/diagnostic_reports#/u/${unit_id}/a/${activity_id}/c/${classroom_id}/recommendations`
      return {
        id: `${activity_id}-${classroom_id}-${unit_id}`,
        assignedDate: moment(assigned_date).format('MMM D, YYYY'),
        class: classroom_name,
        unitName: unit_name,
        completed: `${completed_count} of ${assigned_count}`,
        recommendations: completed_count ? <a className="quill-button small secondary outlined" href={recommendationsHref}>View</a> : null
      }
    })

  return (<section className="individual-assignments">
    <DataTable headers={headers} rows={rows} />
  </section>)
}

const DiagnosticHeader = ({ diagnostic, handleClickDiagnosticHeader, }: DiagnosticHeaderProps) => {
  const { name, classes_count, total_assigned, total_completed, id, last_assigned, } = diagnostic

  return (<button className="diagnostic-card-header" onClick={handleClickDiagnosticHeader} type="button">
    <section className="diagnostic-info">
      <h2 className="diagnostic-name">{name}</h2>
      <div className="diagnostic-data">
        <a className="item" href={`/activity_sessions/anonymous?activity_id=${id}`} rel="noopener noreferrer" target="_blank">Preview</a>
        <span className="item assigned-counts">Assigned: {classes_count} class{classes_count !== 1 && 'es'}, {total_assigned} student{total_assigned !== 1 && 's'}</span>
        <span className="item completed-count">Students completed: {total_completed} of {total_assigned}</span>
        <span className="item">Last assigned: {moment(last_assigned).format('MMM D, YYYY')}</span>
      </div>
    </section>
    <img alt="arrow" className="expand-arrow" src={expandSrc} />
  </button>)
}


const Diagnostic = ({ diagnostic }) => {
  const { id, } = diagnostic

  const [isOpen, setIsOpen] = React.useState<boolean>(!closedDiagnosticCardIdArray().includes(String(diagnostic.id)))

  const onClickDiagnosticHeader = () => {
    let newClosedDiagnosticCardIds
    if (isOpen) {
      newClosedDiagnosticCardIds = closedDiagnosticCardIdArray().concat([id])
      setIsOpen(false)
    } else {
      newClosedDiagnosticCardIds = closedDiagnosticCardIdArray().filter(savedId => savedId !== String(id))
      setIsOpen(true)
    }
    window.localStorage.setItem('closedDiagnosticCardIds', newClosedDiagnosticCardIds.join(','))
  }

  return (<section className={`diagnostic ${isOpen ? 'open' : 'closed'}`}>
    <DiagnosticHeader diagnostic={diagnostic} handleClickDiagnosticHeader={onClickDiagnosticHeader} />
    {isOpen ? <DiagnosticContent diagnostic={diagnostic} /> : null}
  </section>)
}

const DiagnosticActivityPacks = ({passedDiagnostics}) => {
  const [loading, setLoading] = React.useState<DiagnosticActivityPacksState>(!passedDiagnostics);
  const [diagnostics, setDiagnostics] = React.useState<DiagnosticActivityPacksState>(passedDiagnostics || []);

  React.useEffect(() => {
    getDiagnostics();
    $('.diagnostic-tab').addClass('active');
    $('.activity-analysis-tab').removeClass('active');
  }, []);

  const getDiagnostics = () => {
    requestGet('/teachers/diagnostic_units',
      (data) => {
        setDiagnostics(data);
        setLoading(false)
      }
    )
  }

  if (loading) { return <LoadingSpinner /> }
  if (!loading && !diagnostics.length) { return <EmptyDiagnosticProgressReport /> }

  return (
    <div className="container diagnostic-activity-packs">
      <h1>Diagnostic Reports</h1>
      {diagnostics && diagnostics.map(d => <Diagnostic diagnostic={d} key={d.id} />)}
    </div>
  )
}

export default DiagnosticActivityPacks
