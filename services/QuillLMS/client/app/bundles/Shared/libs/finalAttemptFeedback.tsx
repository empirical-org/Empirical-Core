import React from "react";

import { Feedback } from "../components/renderForQuestions";

export const finalAttemptFeedback = (latestAttempt: string, correctResponse: string) => {
  const finalAttemptFeedback = `<b>Good try!</b> Compare your response to the strong response, and then go on to the next question.<br><br><b>Your response</b><br>${latestAttempt}<br><br><b>A strong response</b><br>${correctResponse}`
  return (
    <Feedback
      feedback={<p dangerouslySetInnerHTML={{ __html: finalAttemptFeedback }} />}
      feedbackType="incorrect-continue"
    />
  )
};
