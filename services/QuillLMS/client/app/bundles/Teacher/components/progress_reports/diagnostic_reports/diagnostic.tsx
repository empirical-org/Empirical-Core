import * as React from 'react'
import $ from 'jquery'
import * as moment from 'moment'

import { DataTable } from 'quill-component-library/dist/componentLibrary'

import { Diagnostic, } from './diagnostic_activity_packs'

const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`

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
        recommendations: <a className="quill-button small secondary outlined" href={recommendationsHref}>View</a>
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

export default Diagnostic
