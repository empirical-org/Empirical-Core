import * as React from 'react'

import ActivitySurvey from '../activitySlides/activitySurvey'
import PostActivitySlide from '../activitySlides/postActivitySlide'
import ThankYouSlide from '../activitySlides/thankYouSlide'

const ActivityFollowUp = ({ activity, dispatch, responses, sessionID, saveActivitySurveyResponse, previewMode }) => {
  const [showActivitySurvey, setShowActivitySurvey] = React.useState(false)
  const [submittedActivitySurvey, setSubmittedActivitySurvey] = React.useState(false)

  function onClickNext() { setShowActivitySurvey(true) }

  if (submittedActivitySurvey && !previewMode) {
    return <ThankYouSlide />
  }

  if (showActivitySurvey && !previewMode) {
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
  return <PostActivitySlide handleClick={onClickNext} previewMode={previewMode} prompts={activity && activity.prompts} responses={responses} />
}

export default ActivityFollowUp
