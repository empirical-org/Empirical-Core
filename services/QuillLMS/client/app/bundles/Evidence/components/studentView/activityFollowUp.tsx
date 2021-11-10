import * as React from 'react'

import PostActivitySlide from '../activitySlides/postActivitySlide'
import ThankYouSlide from '../activitySlides/thankYouSlide'
import ActivitySurvey from '../activitySlides/activitySurvey'

const ActivityFollowUp = ({ responses, user, sessionID, saveActivitySurveyResponse, }) => {
  console.log("in ActivityFollowUp")
  const [showActivitySurvey, setShowActivitySurvey] = React.useState(false)
  const [submittedActivitySurvey, setSubmittedActivitySurvey] = React.useState(false)

  function onClickNext() { setShowActivitySurvey(true) }

  if (submittedActivitySurvey) {
    return <ThankYouSlide />
  }
  console.log("HERE 1")
  if (showActivitySurvey) {
    return (<ActivitySurvey
      saveActivitySurveyResponse={saveActivitySurveyResponse}
      sessionID={sessionID}
      setSubmittedActivitySurvey={setSubmittedActivitySurvey}
    />)
  }
  console.log("HERE 2")
  return <PostActivitySlide handleClick={onClickNext} responses={responses} user={user} />
}

export default ActivityFollowUp
