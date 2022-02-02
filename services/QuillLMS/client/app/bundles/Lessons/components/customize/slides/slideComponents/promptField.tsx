import * as React from 'react'
import MultipleTextEditor from './multipleTextEditor.jsx'

interface promptFieldProps {
  handleTextChange: any,
  text: string,
  incompletePrompt: Boolean,
  showBlockquote: Boolean
}

const PromptField: React.SFC<any> = (props) => {
  return (
    <div className="prompt-field field">
      <label>Prompt {props.blankInstructions}</label>
      <div className="control">
        <MultipleTextEditor
          handleTextChange={(e) => props.handleTextChange(e)}
          incompletePrompt={props.incompletePrompt}
          reset={props.reset}
          showBlockquote={props.showBlockquote}
          text={props.text}
        />
      </div>
    </div>
  )
}

export default PromptField
