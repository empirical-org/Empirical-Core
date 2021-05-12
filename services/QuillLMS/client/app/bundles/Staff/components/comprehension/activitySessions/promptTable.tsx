import * as React from "react";
import stripHtml from "string-strip-html";
import { Link } from 'react-router-dom';

import { DataTable, Spinner } from '../../../../Shared/index';
import { PROMPT_ATTEMPTS_FEEDBACK_LABELS, PROMPT_HEADER_LABELS, DEFAULT_MAX_ATTEMPTS, NONE } from '../../../../../constants/comprehension';
import { ActivityInterface, PromptInterface } from "../../../interfaces/comprehensionInterfaces";

interface PromptTableProps {
  activity: ActivityInterface;
  prompt: PromptInterface;
  showHeader?: boolean;
}
const PromptTable = ({ activity, prompt, showHeader }: PromptTableProps) => {


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
      const feedbackLink = (
        <Link
          className="data-link"
          rel="noopener noreferrer"
          target="_blank"
          to={`/activities/${id}/rules-analysis/${promptConjunction}/rule/${rule_uid}/prompt/${prompt_id}`}
        >{feedback_type}</Link>
      );
      const feedbackObject: any = {
        id: `${rule_uid}:${i}:feedback`,
        status: feedbackLabel,
        results: stripHtml(feedback_text),
        feedback: feedbackLink,
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
    { name: "Feedback Type", attribute:"feedback", width: "100px" }
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
