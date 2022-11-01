import * as React from "react";
import stripHtml from "string-strip-html";
import { Link } from 'react-router-dom';
import { useQueryClient, } from 'react-query';

import { createOrUpdateFeedbackHistoryRating } from '../../../utils/evidence/feedbackHistoryRatingAPIs';
import { DataTable, Spinner, ButtonLoadingSpinner } from '../../../../Shared/index';
import { PROMPT_ATTEMPTS_FEEDBACK_LABELS, PROMPT_HEADER_LABELS, DEFAULT_MAX_ATTEMPTS, NONE, STRONG, WEAK } from '../../../../../constants/evidence';
import { ActivityInterface, PromptInterface, RuleInterface } from "../../../interfaces/evidenceInterfaces";
import { getCheckIcon } from "../../../helpers/evidence/renderHelpers";

interface PromptTableProps {
  activity: ActivityInterface;
  rules: RuleInterface[];
  prompt: PromptInterface;
  sessionId: string;
  showHeader?: boolean;
}
const PromptTable = ({ activity, rules, prompt, showHeader, sessionId }: PromptTableProps) => {

  const [loadingType, setLoadingType] = React.useState<string>(null);

  const queryClient = useQueryClient()

  function formatFirstTableData(prompt: any) {
    const { attempts } = prompt;
    const keys = attempts && Object.keys(attempts);
    let completed: boolean;
    let optimal: boolean;
    if(keys && keys.length === DEFAULT_MAX_ATTEMPTS) {
      completed = true;
    } else {
      const usedAttempts = [];
      keys.forEach(key => {
        attempts[key].forEach((attempt: any) => {
          if(attempt.used) {
            usedAttempts.push(attempt);
          }
        });
      });
      completed = usedAttempts.some((attempt) => attempt.optimal);
      optimal = completed ? true : false
    }
    return {
      attemptsLabel: 'Attempts',
      attemptsValue: keys.length,
      completedLabel: 'Completed',
      completedValue: getCheckIcon(completed),
      optimalLabel: 'Reached Optimal',
      optimalValue: getCheckIcon(optimal)
    }
  }

  async function toggleStrength(attempt) { updateFeedbackHistoryRatingStrength(attempt.id, attempt.most_recent_rating === true ? null : true, `${STRONG}-${attempt.id}`) }

  async function toggleWeakness(attempt) { updateFeedbackHistoryRatingStrength(attempt.id, attempt.most_recent_rating === false ? null : false, `${WEAK}-${attempt.id}`) }

  async function updateFeedbackHistoryRatingStrength(responseId, rating, type) {
    setLoadingType(type);
    createOrUpdateFeedbackHistoryRating({ rating, feedback_history_id: responseId}).then((response) => {
      queryClient.refetchQueries(`activity-${activity.id}-session-${sessionId}`).then(() => {
        setLoadingType(null);
      });
    });
  }

  function getRuleName(ruleUID: string) {
    if (!rules) return null;

    const rule = rules.find((rule) => { return rule.uid === ruleUID });
    return rule ? rule.name: ''
  }

  function getStrongWeakButtons(attempt: any) {
    const { id, most_recent_rating } = attempt;
    return(
      <div className="strength-buttons">
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <button className={most_recent_rating ? 'strength-button strong' : 'strength-button'} onClick={() => toggleStrength(attempt)} type="button">
          {loadingType === `${STRONG}-${id}` ? <ButtonLoadingSpinner /> : STRONG}
        </button>
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <button className={most_recent_rating === false ? 'strength-button weak' : 'strength-button'} onClick={() => toggleWeakness(attempt)} type="button">
          {loadingType === `${WEAK}-${id}` ? <ButtonLoadingSpinner /> : WEAK}
        </button>
      </div>
    );
  }

  function formatFeedbackData(prompt: any) {
    const { attempts, prompt_id } = prompt;
    const { id, prompts } = activity;
    const matchedPrompt = prompts.filter(p => p.id === prompt_id)[0];
    const keys = attempts && Object.keys(attempts);
    const rows = [];
    keys.map((key, i) => {
      const filteredAttempt = attempts[key].filter(attempt => attempt.used)[0];
      const attempt = filteredAttempt || attempts[key][0];
      const { entry, feedback_text, feedback_type, optimal, rule_uid } = attempt;
      const ruleName = getRuleName(rule_uid);
      const { attemptLabel, feedbackLabel } = PROMPT_ATTEMPTS_FEEDBACK_LABELS[key];
      const promptText = matchedPrompt && matchedPrompt.text;
      const promptConjunction = matchedPrompt && matchedPrompt.conjunction;
      const attemptObject: any = {
        id: `${rule_uid}:${i}:attempt`,
        status: attemptLabel,
        results: (
          <div>
            <b>{promptText}</b>
            <p className="entry">{entry}</p>
          </div>
        )
      };
      const feedbackLinkLabel = `${feedback_type}: ${ruleName}`
      const feedbackLink = (
        <Link
          className="data-link word-wrap"
          rel="noopener noreferrer"
          target="_blank"
          to={`/activities/${id}/rules-analysis/${promptConjunction}/rule/${rule_uid}/prompt/${prompt_id}`}
        >{feedbackLinkLabel}</Link>
      );
      const feedbackObject: any = {
        id: `${rule_uid}:${i}:feedback`,
        status: feedbackLabel,
        results: <p className="word-wrap">{stripHtml(feedback_text)}</p>,
        feedback: feedbackLink,
        buttons: getStrongWeakButtons(attempt),
        className: optimal ? 'optimal' : 'sub-optimal'
      };
      rows.push(attemptObject);
      rows.push(feedbackObject);
    });
    return rows;
  }

  if(!prompt) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(prompt && prompt.text === NONE) {
    const { conjunction, text } = prompt;
    return(
      <section className="prompt-table-container">
        <section className="attempts-section">
          <p className="attempts-label">{PROMPT_HEADER_LABELS[conjunction]}</p>
          <p className="attempts-value">{text}</p>
        </section>
      </section>
    );
  }

  const dataTableFields = [
    { name: "Status", attribute:"status", width: "100px" },
    { name: "Results", attribute:"results", width: "600px" },
    { name: "Rule", attribute:"feedback", width: "300px" },
    { name: "", attribute:"buttons", width: "120px" }
  ];

  const { conjunction } = prompt;
  const firstTableData = formatFirstTableData(prompt);
  const { attemptsLabel, attemptsValue, completedLabel, completedValue, optimalLabel, optimalValue } = firstTableData

  return(
    <section className="prompt-table-container">
      {showHeader && <h3>{PROMPT_HEADER_LABELS[conjunction]}</h3>}
      <section className="attempts-section">
        <p className="attempts-label">{attemptsLabel}</p>
        <p className="attempts-value">{attemptsValue}</p>
      </section>
      <section className="completed-section">
        <p className="completed-label">{completedLabel}</p>
        <p className="completed-value">{completedValue}</p>
      </section>
      <section className="optimal-section">
        <p className="completed-label">{optimalLabel}</p>
        <p className="completed-value">{optimalValue}</p>
      </section>
      <DataTable
        className="attempts-feedback-table"
        headers={dataTableFields}
        rows={formatFeedbackData(prompt)}
      />
    </section>
  );
}

export default PromptTable;
