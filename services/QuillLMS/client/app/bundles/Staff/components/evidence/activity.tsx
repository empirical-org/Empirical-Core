import * as React from "react";
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import Navigation from './navigation'
import ActivitySettingsWrapper from './configureSettings/activitySettingsWrapper';
import RulesIndexRouter from './configureRules/rulesIndexRouter';
import Rule from './configureRules/rule';
import RulesAnalysis from './rulesAnalysis/rulesAnalysis';
import ActivityStats from './activityStats/activityStats';
import RuleAnalysis from './rulesAnalysis/ruleAnalysis';
import TurkSessions from './gatherResponses/turkSessions';
import SessionsIndex from './activitySessions/sessionsIndex';
import SessionView from './activitySessions/sessionView';
import SemanticLabelsIndex from './semanticRules/semanticLabelsIndex';
import RegexRulesRouter from './regexRules/regexRulesRouter';
import PlagiarismRulesRouter from './plagiarismRules/plagiarismRulesRouter';
import LowConfidenceRulesRouter from './lowConfidenceRules/lowConfidenceRulesRouter';
import ChangeLog from './changeLog/changeLog';
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
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default withRouter(Activity)
