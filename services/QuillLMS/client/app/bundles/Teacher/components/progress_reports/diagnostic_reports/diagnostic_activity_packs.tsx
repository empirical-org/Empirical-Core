import * as React from 'react'
import $ from 'jquery'

import { DataTable } from 'quill-component-library/dist/componentLibrary'

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
        // setDiagnostics(data);
        setLoading(false)
      }
    )
  }

  if (loading) { return <LoadingSpinner /> }
  if (!loading && !diagnostics.length) { return <EmptyDiagnosticProgressReport /> }

  return (
    <div className="container manage-units">
      <div className="activity-analysis">
        <h1>Diagnostic Analysis</h1>
        <p>Open a diagnostic report to view student&#39; responses, the overall results on each question, and the individualized recommendations for each student.</p>
      </div>
    </div>
  )
}

export default DiagnosticActivityPacks
