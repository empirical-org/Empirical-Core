import * as React from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "react-query";

import SubmissionModal from "./shared/submissionModal";
import { fetchActivity } from "../../utils/evidence/activityAPIs";
import { GEN_AI_AI_TYPE } from "../../../../constants/evidence";

const NEW = "new";
const RULES_ANALYSIS_PATH = "rules-analysis"
const SEMANTIC_LABELS_PATH = "semantic-labels"
const RULES_INDEX_PATH = "rules-index"
const LLM_PROMPT_TRIALS_PATH = "llm-prompt-trials"

const subLinkPaths = ["because", "but", "so"];

const Navigation = ({ location, match }) => {
  const { pathname } = location;
  const { params } = match;
  const { activityId } = params;
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);

  const { data: activityData } = useQuery(
    [`activity-${activityId}`, activityId],
    fetchActivity,
    {
      enabled: activityId && activityId !== NEW, // Only fetch when activityId is valid
    }
  );

  const aiType = activityData?.activity?.ai_type;

  function checkOverviewActive() {
    return location && pathname === "/activities";
  }

  function toggleSubmissionModal() {
    setShowSubmissionModal(!showSubmissionModal);
  }

  function renderSubmissionModal() {
    return <SubmissionModal close={toggleSubmissionModal} message="Submission successful!" />;
  }

  function renderSubLinks(basePath) {
    return subLinkPaths.map((subLink) => (
      <NavLink
        activeClassName="is-active"
        className="sublink"
        key={subLink}
        to={`/activities/${activityId}/${basePath}/${subLink}`}
      >
        {subLink.charAt(0).toUpperCase() + subLink.slice(1)}
      </NavLink>
    ));
  }

  const subLinksMap = {
    [RULES_ANALYSIS_PATH]: renderSubLinks(RULES_ANALYSIS_PATH),
    [SEMANTIC_LABELS_PATH]: renderSubLinks(SEMANTIC_LABELS_PATH),
    [RULES_INDEX_PATH]: renderSubLinks(RULES_INDEX_PATH),
    [LLM_PROMPT_TRIALS_PATH]: renderSubLinks(LLM_PROMPT_TRIALS_PATH),
  };

  let activityEditorAndResults;

  if (activityId && activityId !== NEW) {
    activityEditorAndResults = (
      <React.Fragment>
        <p className="menu-label">Activity Editor</p>
        <ul className="menu-list">
          <NavLink activeClassName="is-active" to={`/activities/${activityId}/settings`}>
            Activity Settings
          </NavLink>
          {aiType !== GEN_AI_AI_TYPE && (
            <React.Fragment>
              <NavLink activeClassName="is-active" to={`/activities/${activityId}/${SEMANTIC_LABELS_PATH}`}>
                Semantic Labels
              </NavLink>
              {pathname.includes(SEMANTIC_LABELS_PATH) && subLinksMap[SEMANTIC_LABELS_PATH]}
            </React.Fragment>
          )}
          {aiType === GEN_AI_AI_TYPE && (
            <React.Fragment>
              <NavLink activeClassName="is-active" to={`/activities/${activityId}/${LLM_PROMPT_TRIALS_PATH}`}>
                LLM Prompt Trials
              </NavLink>
              {pathname.includes(LLM_PROMPT_TRIALS_PATH) && subLinksMap[LLM_PROMPT_TRIALS_PATH]}
            </React.Fragment>
          )}
          <NavLink activeClassName="is-active" to={`/activities/${activityId}/regex-rules`}>
            RegEx Rules
          </NavLink>
          <NavLink activeClassName="is-active" to={`/activities/${activityId}/plagiarism-rules`}>
            Plagiarism Rules
          </NavLink>
          {aiType !== GEN_AI_AI_TYPE && (
            <NavLink activeClassName="is-active" to={`/activities/${activityId}/low-confidence-rules`}>
              Low Confidence Rules
            </NavLink>
          )}
          <NavLink activeClassName="is-active" to={`/activities/${activityId}/${RULES_INDEX_PATH}`}>
            View All Rules
          </NavLink>
          {pathname.includes(RULES_INDEX_PATH) && subLinksMap[RULES_INDEX_PATH]}
        </ul>
        <p className="menu-label">Data Generation</p>
        <ul className="menu-list">
          <NavLink activeClassName="is-active" to={`/activities/${activityId}/turk-sessions`}>
            Collect Turk Responses
          </NavLink>
          <NavLink activeClassName="is-active" to={`/activities/${activityId}/synthetic/seed-data`}>
            Create Seed Data
          </NavLink>
          <NavLink activeClassName="is-active" to={`/activities/${activityId}/synthetic/labeled-data-upload`}>
            Generate Labeled Synthetic Data
          </NavLink>
        </ul>
        <p className="menu-label">Activity Results</p>
        <ul className="menu-list">
          <NavLink activeClassName="is-active" to={`/activities/${activityId}/stats`}>
            Activity Stats
          </NavLink>
          <NavLink activeClassName="is-active" to={`/activities/${activityId}/activity-sessions`}>
            View Sessions
          </NavLink>
          <NavLink activeClassName="is-active" to={`/activities/${activityId}/${RULES_ANALYSIS_PATH}/because`}>
            Rules Analysis
          </NavLink>
          {pathname.includes(RULES_ANALYSIS_PATH) && subLinksMap[RULES_ANALYSIS_PATH]}
        </ul>
        <p className="menu-label">Change Log</p>
        <ul className="menu-list">
          <NavLink activeClassName="is-active" to={`/activities/${activityId}/change-log`}>
            Change Log
          </NavLink>
          <NavLink activeClassName="is-active" to={`/activities/${activityId}/version-history`}>
            Version History
          </NavLink>
        </ul>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <section className="left-side-menu">
        <p className="menu-label">Tool Views</p>
        <ul className="menu-list">
          <NavLink activeClassName="is-active" isActive={checkOverviewActive} to="/activities">
            View Activities
          </NavLink>
          <NavLink activeClassName="is-active" to="/activities/new">
            Create New Activity
          </NavLink>
          <NavLink activeClassName="is-active" to="/llm-prompt-templates">
            View LLM Prompt Templates
          </NavLink>
          <NavLink activeClassName="is-active" to="/universal-rules">
            View Universal Rules
          </NavLink>
          <NavLink activeClassName="is-active" to="/hints">
            View Hints
          </NavLink>
          <NavLink activeClassName="is-active" to="/health-dashboards">
            Health Dashboard
          </NavLink>
        </ul>
        {activityEditorAndResults}
      </section>
      {showSubmissionModal && renderSubmissionModal()}
    </React.Fragment>
  );
};

export default Navigation;
