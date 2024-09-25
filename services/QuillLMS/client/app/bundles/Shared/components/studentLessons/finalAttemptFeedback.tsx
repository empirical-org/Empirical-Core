import * as React from 'react';
import { Feedback } from '../renderForQuestions/feedback';
import { INCORRECT_CONTINUE } from '../../utils/constants';

const FinalAttemptFeedback = ({ latestAttempt, correctResponse, translate, showTranslation }) => {
  const finalAttemptFeedback = `<b>Good try!</b> Compare your response to the strong response, and then go on to the next question.<br><br><b>Your response</b><br>${latestAttempt}<br><br><b>A strong response</b><br>${correctResponse}`
  return (
    <Feedback
      correctResponse={correctResponse}
      feedback={<p dangerouslySetInnerHTML={{ __html: finalAttemptFeedback }} />}
      feedbackType={INCORRECT_CONTINUE}
      latestAttempt={latestAttempt}
      showTranslation={showTranslation}
      translate={translate}
    />
  )
};

export { FinalAttemptFeedback };
