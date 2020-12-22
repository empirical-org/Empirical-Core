import * as React from "react";

import { DataTable, Spinner } from '../../../../Shared/index';
import { PROMPT_SESSION_LABELS } from '../../../../../constants/comprehension';

const quillCheckmark = 'https://assets.quill.org/images/icons/check-circle-small.svg';

const SessionsIndex = ({ prompt }) => {


  function formatFirstTableData(prompt) {
    const { attempts, conjunction } = prompt;
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

  if(!prompt) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

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
    </section>
  );
}

export default SessionsIndex
