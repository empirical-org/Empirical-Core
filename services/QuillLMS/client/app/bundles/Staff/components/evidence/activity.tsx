import * as React from "react";
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import SessionsIndex from './activitySessions/sessionsIndex';
import SessionView from './activitySessions/sessionView';
import ActivityStats from './activityStats/activityStats';
import ChangeLog from './changeLog/changeLog';
import Rule from './configureRules/rule';
import RulesIndexRouter from './configureRules/rulesIndexRouter';
import ActivitySettingsWrapper from './configureSettings/activitySettingsWrapper';
import TurkSessions from './gatherResponses/turkSessions';
import LowConfidenceRulesRouter from './lowConfidenceRules/lowConfidenceRulesRouter';
import Navigation from './navigation';
import PlagiarismRulesRouter from './plagiarismRules/plagiarismRulesRouter';
import RegexRulesRouter from './regexRules/regexRulesRouter';
import RuleAnalysis from './rulesAnalysis/ruleAnalysis';
import RulesAnalysis from './rulesAnalysis/rulesAnalysis';
import SemanticLabelsIndex from './semanticRules/semanticLabelsIndex';
import LabeledDataUploadForm from "./syntheticData/labeledDataUploadForm";
import SeedDataForm from "./syntheticData/seedDataForm";
import VersionHistory from "./versionHistory/versionHistory";

import { ActivityRouteProps } from '../../interfaces/evidenceInterfaces';

const Activity: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match, location, }) => {
  return(
    <React.Fragment>
      <Navigation location={location} match={match} />
      <div className="activity-container">
        <Switch>
          <Redirect exact from='/activities/:activityId' to='/activities/:activityId/settings' />
          <Route component={ActivitySettingsWrapper} path='/activities/new/settings' />
          <Route component={ActivitySettingsWrapper} path='/activities/:activityId/settings' />
          <Route component={Rule} path='/activities/:activityId/rules/:ruleId' />
          <Route component={RulesIndexRouter} path='/activities/:activityId/rules-index' />
          <Route component={ActivityStats} path='/activities/:activityId/stats' />
          <Route component={RuleAnalysis} path='/activities/:activityId/rules-analysis/:promptConjunction/rule/:ruleId/prompt/:promptId' />
          <Route component={RulesAnalysis} path='/activities/:activityId/rules-analysis/:promptConjunction' />
          <Route component={RulesAnalysis} path='/activities/:activityId/rules-analysis' />
          <Route component={TurkSessions} path='/activities/:activityId/turk-sessions' />
          <Route component={SessionView} path='/activities/:activityId/activity-sessions/:sessionId' />
          <Route component={SessionsIndex} path='/activities/:activityId/activity-sessions' />
          <Route component={SemanticLabelsIndex} path='/activities/:activityId/semantic-labels' />
          <Route component={RegexRulesRouter} path='/activities/:activityId/regex-rules' />
          <Route component={PlagiarismRulesRouter} path='/activities/:activityId/plagiarism-rules' />
          <Route component={LowConfidenceRulesRouter} path='/activities/:activityId/low-confidence-rules' />
          <Route component={ChangeLog} path='/activities/:activityId/change-log' />
          <Route component={VersionHistory} path='/activities/:activityId/version-history' />
          <Route component={SeedDataForm} path='/activities/:activityId/synthetic/seed-data' />
          <Route component={LabeledDataUploadForm} path='/activities/:activityId/synthetic/labeled-data-upload' />
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Activity)
