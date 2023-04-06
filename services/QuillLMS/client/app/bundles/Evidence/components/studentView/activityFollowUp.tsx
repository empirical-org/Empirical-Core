import * as React from 'react'

import ActivitySurvey from '../activitySlides/activitySurvey'
import PostActivitySlide from '../activitySlides/postActivitySlide'
import ThankYouSlide from '../activitySlides/thankYouSlide'

const ActivityFollowUp = ({ activity, dispatch, responses, sessionID, saveActivitySurveyResponse, }) => {
  const [showActivitySurvey, setShowActivitySurvey] = React.useState(false)
  const [submittedActivitySurvey, setSubmittedActivitySurvey] = React.useState(false)

  function onClickNext() { setShowActivitySurvey(true) }

  if (submittedActivitySurvey) {
    return <ThankYouSlide />
  }

  if (showActivitySurvey) {
    return (
      <ActivitySurvey
        activity={activity}
        dispatch={dispatch}
        saveActivitySurveyResponse={saveActivitySurveyResponse}
        sessionID={sessionID}
        setSubmittedActivitySurvey={setSubmittedActivitySurvey}
      />
    )
  }
  return <PostActivitySlide handleClick={onClickNext} prompts={activity && activity.prompts} responses={responses} />
}

export default ActivityFollowUp
