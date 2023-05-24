import * as $ from 'jquery';
import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import DiagnosticActivityPacks from './diagnostic_activity_packs';
import IndividualPack from './individualPack';
import { Classroom } from './interfaces';

import { requestGet } from '../../../../../../modules/request/index';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

const DiagnosticsIndex = ({ passedClassrooms, history, match, lessonsBannerIsShowable, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedClassrooms);
  const [classrooms, setClassrooms] = React.useState<Array<Classroom>>(passedClassrooms || []);

  React.useEffect(() => {
    getDiagnostics();
    $('.diagnostic-tab').addClass('active');
    $('.activity-analysis-tab').removeClass('active');
    handleMobileDropdown();
  }, []);

  function handleMobileDropdown() {
    const mobileDiagnosticTab = $('#mobile-diagnostics-tab-checkmark');
    const mobileActivityAnalysisTab = $('#mobile-activity-analysis-tab-checkmark');
    const mobileDropdown = $('#mobile-subnav-toggle');


    if(mobileDropdown && mobileDiagnosticTab && mobileActivityAnalysisTab ) {
      mobileDropdown.removeClass('open');
      mobileDiagnosticTab.addClass('active');
      mobileActivityAnalysisTab.removeClass('active');
    }
    // this is an override since we can only access the current_path from the backend so we just pass back an empty space
    // from the NavigationHelper module
    if(mobileDropdown && mobileDropdown.children()[0] && mobileDropdown.children()[0].children[0]) {
      const subTabElement = $(mobileDropdown.children()[0].children[0]);
      if(subTabElement.text() === ' ' || subTabElement.text() === 'Activity Analysis') {
        subTabElement.text('Diagnostics');
      }
    }
  }

  function getDiagnostics() {
    requestGet('/teachers/diagnostic_units',
      (data) => {
        setClassrooms(data);
        setLoading(false)
      }
    )
  }

  if (loading) { return <LoadingSpinner /> }

  return (
    <Switch>
      <Route path='/diagnostics/:activityId/classroom/:classroomId' render={() => <IndividualPack classrooms={classrooms} lessonsBannerIsShowable={lessonsBannerIsShowable} />} />
      <Route path='/diagnostics' render={() => <DiagnosticActivityPacks classrooms={classrooms} history={history} />} />
    </Switch>
  )
}

export default withRouter(DiagnosticsIndex)
