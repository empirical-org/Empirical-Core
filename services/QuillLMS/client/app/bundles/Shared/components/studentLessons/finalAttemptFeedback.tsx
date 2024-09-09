import * as React from 'react';
import { Feedback } from '../renderForQuestions/feedback';

const FinalAttemptFeedback = ({latestAttempt, correctResponse}) => {
  const finalAttemptFeedback = `<b>Good try!</b> Compare your response to the strong response, and then go on to the next question.<br><br><b>Your response</b><br>${latestAttempt}<br><br><b>A strong response</b><br>${correctResponse}`
  return (
    <Feedback
      feedback={<p dangerouslySetInnerHTML={{ __html: finalAttemptFeedback }} />}
      feedbackType="incorrect-continue"
      latestAttempt={latestAttempt}
      correctResponse={correctResponse}
    />
  )
};

export { FinalAttemptFeedback };
