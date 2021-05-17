import * as React from "react";
import stripHtml from "string-strip-html";
import { Link } from 'react-router-dom';
import { queryCache } from 'react-query';

import { createOrUpdateFeedbackHistoryRating } from '../../../utils/comprehension/feedbackHistoryRatingAPIs';
import { DataTable, Spinner } from '../../../../Shared/index';
import { PROMPT_ATTEMPTS_FEEDBACK_LABELS, PROMPT_HEADER_LABELS, DEFAULT_MAX_ATTEMPTS, NONE } from '../../../../../constants/comprehension';
import { ActivityInterface, PromptInterface } from "../../../interfaces/comprehensionInterfaces";

interface PromptTableProps {
  activity: ActivityInterface;
  prompt: PromptInterface;
  sessionId: string;
  showHeader?: boolean;
}
const PromptTable = ({ activity, prompt, showHeader, sessionId }: PromptTableProps) => {


  function formatFirstTableData(prompt: any) {
    const { attempts } = prompt;
    const keys = attempts && Object.keys(attempts);
    let completed: boolean;
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
    }
    return {
      attemptsLabel: 'Attempts',
      attemptsValue: keys.length,
      completedLabel: 'Completed',
      completedValue: completed ? 'True' : 'False'
    }
  }

  async function toggleStrength(attempt) { updateFeedbackHistoryRatingStrength(attempt.id, attempt.most_recent_rating === true ? null : true) }

  async function toggleWeakness(attempt) { updateFeedbackHistoryRatingStrength(attempt.id, attempt.most_recent_rating === false ? null : false) }

  async function updateFeedbackHistoryRatingStrength(responseId, rating) {
    createOrUpdateFeedbackHistoryRating({ rating, feedback_history_id: responseId}).then((response) => {
      queryCache.refetchQueries(`activity-${activity.id}-session-${sessionId}`);
    });
  }

  function getStrongWeakButtons(attempt: any) {
    const { most_recent_rating } = attempt;
    return(
      <div className="strength-buttons">
        <button className={most_recent_rating ? 'strength-button strong' : 'strength-button'} onClick={() => toggleStrength(attempt)} type="button">Strong</button>
        <button className={most_recent_rating === false ? 'strength-button weak' : 'strength-button'} onClick={() => toggleWeakness(attempt)} type="button">Weak</button>
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
      const feedbackLinkLabel = `${feedback_type}:${rule_uid ? rule_uid.substring(0,6) : ''}`
      const feedbackLink = (
        <Link
          className="data-link"
          rel="noopener noreferrer"
          target="_blank"
          to={`/activities/${id}/rules-analysis/${promptConjunction}/rule/${rule_uid}/prompt/${prompt_id}`}
        >{feedbackLinkLabel}</Link>
      );
      const feedbackObject: any = {
        id: `${rule_uid}:${i}:feedback`,
        status: feedbackLabel,
        results: stripHtml(feedback_text),
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
    { name: "Results", attribute:"results", width: "800px" },
    { name: "Feedback Type", attribute:"feedback", width: "120px" },
    { name: "", attribute:"buttons", width: "120px" }
  ];

  const { conjunction } = prompt;
  const firstTableData = formatFirstTableData(prompt);
  const { attemptsLabel, attemptsValue, completedLabel, completedValue } = firstTableData

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
      <DataTable
        className="attempts-feedback-table"
        headers={dataTableFields}
        rows={formatFeedbackData(prompt)}
      />
    </section>
  );
}

export default PromptTable;
