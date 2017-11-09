import * as React from 'react'
import MultipleTextEditor from './multipleTextEditor.jsx'

interface promptFieldProps {
  handleTextChange: any,
  text: string,
  incompletePrompt: Boolean
}

const PromptField: React.SFC<any> = (props) => {
  console.log(props)
  return <div className="prompt-field field">
    <label>Prompt</label>
    <div className="control">
      <MultipleTextEditor
        incompletePrompt={props.incompletePrompt}
        text={props.text}
        handleTextChange={(e) => props.handleTextChange(e)}
      />
    </div>
  </div>
}

export default PromptField
