import * as React from "react";

import { DataTable, Spinner } from '../../../../Shared/index';
import { PROMPT_SESSION_LABELS, PROMPT_ATTEMPTS_FEEDBACK_LABELS } from '../../../../../constants/comprehension';

const SessionsIndex = ({ prompt }) => {


  function formatFirstTableData(prompt: any) {
    const { attempts } = prompt;
    const keys = attempts && Object.keys(attempts);
    let completed
    if(keys.length === 5) {
      completed = true;
    } else {
      const usedAttempts = [];
      keys.forEach(key => {
        attempts[key].forEach(attempt => {
          // only get
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
    const keys = attempts && Object.keys(attempts);
    const rows = [];
    keys.map((key: any, i: number) => {
      const attempt = attempts[key][0];
      const { entry, feedback_text, feedback_type } = attempt;
      const { attemptLabel, feedbackLabel } = PROMPT_ATTEMPTS_FEEDBACK_LABELS[key];
      const attemptObject: any = {};
      const feedbackObject: any = {};
      attemptObject.status = attemptLabel;
      attemptObject.results = entry;
      feedbackObject.status = feedbackLabel;
      feedbackObject.results = feedback_text;
      feedbackObject.feedback = feedback_type;
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

  const dataTableFields = [
    { name: "Status", attribute:"status", width: "100px" },
    { name: "Results", attribute:"results", width: "500px" },
    { name: "Feedback Type", attribute:"feedback", width: "100px" }
  ];

  const firstTableData = formatFirstTableData(prompt);
  const { attemptsLabel, attemptsValue, completedLabel, completedValue } = firstTableData
  const { conjunction } = prompt;

  return(
    <section className="prompt-table-container">
      <h2>{`${PROMPT_SESSION_LABELS[conjunction]}`}</h2>
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

export default SessionsIndex
