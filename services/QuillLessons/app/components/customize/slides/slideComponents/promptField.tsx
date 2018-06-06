import * as React from 'react'
import MultipleTextEditor from './multipleTextEditor.jsx'

interface promptFieldProps {
  handleTextChange: any,
  text: string,
  incompletePrompt: Boolean,
  showBlockquote: Boolean
}

const PromptField: React.SFC<any> = (props) => {
  return <div className="prompt-field field">
    <label>Prompt {props.blankInstructions}</label>
    <div className="control">
      <MultipleTextEditor
        incompletePrompt={props.incompletePrompt}
        text={props.text}
        handleTextChange={(e) => props.handleTextChange(e)}
        showBlockquote={props.showBlockquote}
      />
    </div>
  </div>
}

export default PromptField
