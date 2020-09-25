import * as React from 'react'
import * as $ from 'jquery'

import EmptyDiagnosticProgressReport from './empty_diagnostic_progress_report.jsx'
import Diagnostic from './diagnostic'

import { requestGet } from '../../../../../modules/request/index';
import LoadingSpinner from '../../shared/loading_indicator.jsx'

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

export interface Diagnostic {
  name: string;
  id: string;
  individual_assignments: Array<Assignment>;
  classes_count: number;
  total_assigned: number;
  total_completed: number;
  last_assigned: string
}


const DiagnosticActivityPacks = ({passedDiagnostics}) => {
  const [loading, setLoading] = React.useState<boolean>(!passedDiagnostics);
  const [diagnostics, setDiagnostics] = React.useState<Array<Diagnostic>>(passedDiagnostics || []);

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
