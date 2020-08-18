import * as React from 'react'
import $ from 'jquery'

import { DataTable } from 'quill-component-library/dist/componentLibrary'

const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`

import { requestGet } from '../../../../../modules/request/index';

import LoadingSpinner from '../../shared/loading_indicator.jsx'
import EmptyDiagnosticProgressReport from './empty_diagnostic_progress_report.jsx'

interface Assignment {
  classroom_name: string,
  activity_name: string,
  activity_id: number,
  unit_id: number,
  classroom_id: number,
  completed_count: number,
  assigned_count: number
}

interface Diagnostic {
  name: string;
  id: string;
  individual_assignments: Array<Assignment>;
  classes_count: number;
  total_assigned: number;
  total_completed: number;
}

interface DiagnosticActivityPacksState {
  loading: boolean;
  diagnostics: Array<Diagnostic>;
}

const DiagnosticHeader = (diagnostic, open, closedDiagnosticCardIdsArray) => {
  const clickDiagnosticHeader = () => {
    const newClosedDiagnosticCardIds = open ? closedDiagnosticCardIdsArray.push(diagnostic.id) : closedDiagnosticCardIdsArray.filter(diagnostic.id)
    window.localStorage.set('closedDiagnosticCardIds', newClosedDiagnosticCardIds.join(','))
  }
  return (<div className="diagnostic-card-header" onClick={clickDiagnosticHeader}>
    <div className="diagnostic-info">
      <h2 className="diagnostic-name">{diagnostic.name}</h2>
      {this.renderDiagnosticData()}
    </div>
    <img className="expand-arrow" src={expandSrc} />
  </div>)
}


const Diagnostic = ({ diagnostic }) => {
  const closedDiagnosticCardIds = window.localStorage.getItem('closedDiagnosticCardIds')
  const closedDiagnosticCardIdArray = closedDiagnosticCardIds ? closedDiagnosticCardIds.split(',') : []
  const open = closedDiagnosticCardIdArray.includes(String(diagnostic.id))

  return (<section className={`diagnostic ${open ? 'open' : 'closed'}`}>
    {DiagnosticHeader(diagnostic, open, closedDiagnosticCardIdArray)}
    {selected ? renderDiagnosticContent(diagnostic) : null}

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
    <div className="container manage-units">
      <div className="activity-analysis">
        <h1>Diagnostic Reports</h1>
        {renderDiagnostics(diagnostics)}
      </div>
    </div>
  )
}

export default DiagnosticActivityPacks
