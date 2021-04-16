import * as React from "react";
import stripHtml from "string-strip-html";

import { DataTable, Spinner } from '../../../../Shared/index';
import { PROMPT_ATTEMPTS_FEEDBACK_LABELS, PROMPT_HEADER_LABELS } from '../../../../../constants/comprehension';
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
    if(keys.length === 5) {
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
      completed = !!usedAttempts.some((attempt) => attempt.optimal);
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
    const { prompts } = activity;
    const matchedPrompt = prompts.filter(prompt => prompt.id === prompt_id)[0];
    const keys = attempts && Object.keys(attempts);
    const rows = [];
    keys.map(key => {
      const filteredAttempt = attempts[key].filter(attempt => attempt.used)[0];
      const attempt = filteredAttempt || attempts[key][0];
      const { entry, feedback_text, feedback_type, optimal } = attempt;
      const { attemptLabel, feedbackLabel } = PROMPT_ATTEMPTS_FEEDBACK_LABELS[key];
      const attemptObject: any = {};
      const feedbackObject: any = {};
      attemptObject.status = attemptLabel;
      attemptObject.results = (<div>
        <b>{matchedPrompt && matchedPrompt.text}</b>
        <p className="entry">{entry}</p>
      </div>);
      feedbackObject.status = feedbackLabel;
      feedbackObject.results = stripHtml(feedback_text);
      feedbackObject.feedback = feedback_type;
      feedbackObject.className = optimal ? 'optimal' : 'sub-optimal'
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

  if(prompt && prompt.text === 'none') {
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
    { name: "Results", attribute:"results", width: "500px" },
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
