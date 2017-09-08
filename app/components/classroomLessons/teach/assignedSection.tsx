declare function require(name:string);
import * as React from 'react'

class AssignedSection extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  optionDependentContent() {
    let text, suggestionHeader, suggestionText
    switch(this.props.selectedOptionKey) {
      case "Small Group Instruction and Independent Practice":
        text = "You've assigned independent practice for unflagged students. Now, you can work with flagged students.";
        suggestionHeader = "Suggestion: Guiding Small Group Instruction";
        suggestionText = "One way to manage small group instruction is to go through more examples on paper. First, you can write out the correct sentences. The students then write out their own sentences using prompts of your choice.";
        break
      case "All Students Practice Now":
        text = "You have successfully assigned independent practice for all your students to complete now."
        break
      case "All Students Practice Later":
        text = "You have successfully assigned independent practice for all your students to complete later."
        break
      case "No Follow Up Practice":
        text = "You have successfully completed the lesson."
        break
    }
    let suggestion
    if (suggestionHeader) {
      suggestion = <div className="suggestion">
        <p className="header">{suggestionHeader}</p>
        <p className="text">{suggestionText}</p>
      </div>
    }
    return <div className="assigned-section">
      <div className="message"><i className="fa fa-check-circle"/> {text}</div>
      {suggestion}
    </div>
  }

  render() {
    return this.optionDependentContent()
  }
}

export default AssignedSection
