import { ContentState, EditorState } from 'draft-js';
import * as React from 'react';

import { ConceptExplanation, TextEditor } from '../../../Shared/index';

interface FeedbackFormProps {
  submitNewFeedback: Function;
  cancelEdit: Function;
  conceptFeedbackID: string;
  description?: string;
  leftBox?: string;
  rightBox?: string;
}

interface FeedbackFormState {
  description: string;
  leftBox: string;
  rightBox: string;
  editing: string;
}

export default class FeedbackForm extends React.Component<FeedbackFormProps, FeedbackFormState> {
  constructor(props: FeedbackFormProps) {
    super(props)

    this.state = {
      description: this.props.description || '',
      leftBox: this.props.leftBox || '',
      rightBox: this.props.rightBox || '',
      editing: "title"
    }

    this.handleChange = this.handleChange.bind(this)
    this.submit = this.submit.bind(this)
    this.cancel = this.cancel.bind(this)
    this.setEditor = this.setEditor.bind(this)
    this.renderEditor = this.renderEditor.bind(this)
  }

  handleChange(key: string, e: string) {
    const newState: FeedbackFormState = this.state
    newState[key] = e;
    this.setState(newState)
  }

  submit(e) {
    const {
      description,
      leftBox,
      rightBox
    } = this.state
    const data = {
      description,
      leftBox,
      rightBox
    }
    this.props.submitNewFeedback(this.props.conceptFeedbackID, data)
  }

  cancel() {
    this.props.cancelEdit(this.props.conceptFeedbackID)
  }

  setEditor(part: string) {
    this.setState({editing: part})
  }

  renderEditor() {
    const parts = ["description", "leftBox", "rightBox"];
    return parts.map((part) => {
      if (part === this.state.editing) {
        return [
          (<label className="label">{part}</label>),
          (<TextEditor
            ContentState={ContentState}
            EditorState={EditorState}
            handleTextChange={this.handleChange.bind(null, part)}
            key={part}
            text={this.state[part]}
          />)
        ]
      } else {
        return [
          (<label className="label">{part}</label>),
          (<div>{this.state[part]}</div>),
          (<a onClick={this.setEditor.bind(null, part)}>Edit</a>)
        ]
      }

    })
  }

  render() {
    return (
      <div>
        <form className="box" onSubmit={this.submit}>
          {this.renderEditor()}
          <br />
          <button className="button is-primary" type="submit">Submit</button>
          <button className="button is-danger" onClick={this.cancel}>Cancel</button>
        </form>
        <ConceptExplanation {...this.state} />
      </div>

    )
  }

}
