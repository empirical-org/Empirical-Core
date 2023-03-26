declare function require(name:string);
import * as React from 'react';

import {
    PRACTICE_LATER, PRACTICE_NOW, SMALL_GROUP_AND_INDEPENDENT
} from '../../constants';


const FollowUpIllustration = `${process.env.CDN_URL}/images/illustrations/celebrating-activity-completion.svg`

const buttonClassName = "quill-button large outlined secondary focus-on-dark"

const generic = <a className={buttonClassName} href={`${process.env.DEFAULT_URL}`}>Exit lesson</a>

const flagged = <h2>Wait for instructions from your teacher.</h2>

const practiceNow = (followUpUrl) => (
  <React.Fragment>
    <h2>Now it&#39;s time to practice what you learned.</h2>
    <a className={buttonClassName} href={followUpUrl}>Begin</a>
  </React.Fragment>
)

const practiceLater = (
  <React.Fragment>
    <h2>Your teacher has assigned some practice for later. You&#39;ll see it on your dashboard when you exit this lesson.</h2>
    {generic}
  </React.Fragment>
)

const WatchTeacher = ({ followUpOption, isFlagged, followUpUrl, }) => {
  let followUpContent = generic

  if (followUpOption === SMALL_GROUP_AND_INDEPENDENT) {
    followUpContent = isFlagged ? flagged : practiceNow(followUpUrl)
  }

  if (followUpOption === PRACTICE_LATER) {
    followUpContent = practiceLater
  }

  if (followUpOption === PRACTICE_NOW) {
    followUpContent = practiceNow(followUpUrl)
  }

  return (
    <div className="follow-up-container full-page-modal-container">
      <div className="follow-up full-page-modal">
        <img alt="An illustration of a teacher pointing to a smart board" src={FollowUpIllustration} />
        <h1>You have completed the lesson!</h1>
        {followUpContent}
      </div>
    </div>
  )
}

export default WatchTeacher;
