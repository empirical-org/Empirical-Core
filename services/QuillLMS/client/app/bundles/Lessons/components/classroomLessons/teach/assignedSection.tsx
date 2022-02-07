declare function require(name:string);
import * as React from 'react'

import {
  SMALL_GROUP_AND_INDEPENDENT,
  PRACTICE_NOW,
  PRACTICE_LATER,
  NO_PRACTICE
} from '../../constants'


const AssignedSection = ({ selectedOptionKey, }) => {
  let text, suggestionHeader, suggestionText
  switch(selectedOptionKey) {
    case SMALL_GROUP_AND_INDEPENDENT:
      text = "You've assigned independent practice for unflagged students. Now, you can work with flagged students.";
      suggestionHeader = "Suggestion: Guiding Small Group Instruction";
      suggestionText = "One way to manage small group instruction is to go through more examples on paper. First, you can write out the correct sentences. The students then write out their own sentences using prompts of your choice.";
      break
    case PRACTICE_NOW:
      text = "You have successfully assigned independent practice for all your students to complete now."
      break
    case PRACTICE_LATER:
      text = "You have successfully assigned independent practice for all your students to complete later."
      break
    case NO_PRACTICE:
      text = "You have successfully completed the lesson."
      break
  }
  let suggestion
  if (suggestionHeader) {
    suggestion = (<div className="suggestion">
      <p className="header">{suggestionHeader}</p>
      <p className="text">{suggestionText}</p>
    </div>)
  }
  return (
    <div className="assigned-section">
      <div className="message"><i className="fa fa-check-circle" /> {text}</div>
      {suggestion}
    </div>
  )
}

export default AssignedSection
