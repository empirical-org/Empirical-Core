import * as React from 'react';
import { Feedback } from '../renderForQuestions/feedback';

const renderOptions = (next, answers) => {
  const components = answers.map(answer => (
    <button className="button lesson-multiple-choice-button" key={answer.key} onClick={next} type="button">
      {answer.text}
    </button>
  )
  );
  return <div className="lesson-multiple-choice">{components}</div>
}

const MultipleChoice = ({ prompt, answers, next, }) => (
  <section className="student-container">
    <div className="content multiple-choice-content">
      {prompt}
      <Feedback
        feedback={<p>Select a strong answer. There may be more than one.</p>}
        feedbackType="override"
        key="multiple-choice"
      />
      {renderOptions(next, answers)}
    </div>
  </section>
)

export { MultipleChoice };

