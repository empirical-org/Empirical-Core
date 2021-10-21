import * as React from 'react'
import * as $ from 'jquery'
import { Switch, Route, withRouter } from 'react-router-dom';

import DiagnosticActivityPacks from './diagnostic_activity_packs'
import IndividualPack from './individual_pack'
import { Classroom, Activity, Diagnostic, } from './interfaces'

import LoadingSpinner from '../../../shared/loading_indicator.jsx'
import { requestGet } from '../../../../../../modules/request/index';

const DiagnosticsIndex = ({ passedClassrooms, history, match, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedClassrooms);
  const [classrooms, setClassrooms] = React.useState<Array<Classroom>>(passedClassrooms || []);

  React.useEffect(() => {
    getDiagnostics();
    $('.diagnostic-tab').addClass('active');
    $('.activity-analysis-tab').removeClass('active');
  }, []);

  const getDiagnostics = () => {
    requestGet('/teachers/diagnostic_units',
      (data) => {
        setClassrooms(data);
        setLoading(false)
      }
    )
  }

  if (loading) { return <LoadingSpinner /> }

  return (<Switch>
    <Route path='/diagnostics/:activityId/classroom/:classroomId' render={() => <IndividualPack classrooms={classrooms} />} />
    <Route path='/diagnostics' render={() => <DiagnosticActivityPacks classrooms={classrooms} history={history} />} />
  </Switch>)
}

export default withRouter(DiagnosticsIndex)
