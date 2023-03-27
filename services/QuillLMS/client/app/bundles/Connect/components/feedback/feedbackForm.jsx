import { ContentState, EditorState } from 'draft-js';
import React from 'react';

import { ConceptExplanation, TextEditor } from '../../../Shared/index';

export default class FeedbackForm extends React.Component {

  state = {
    description: this.props.description,
    leftBox: this.props.leftBox,
    rightBox: this.props.rightBox,
    editing: "title"
  };

  handleChange = (key, e) => {
    const newState = {}
    newState[key] = e;
    this.setState(newState)
  };

  submit = (e) => {
    e.preventDefault();
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
    this.props.submitNewFeedback(this.props.feedbackID, data)
  };

  cancel = () => {
    this.props.cancelEdit(this.props.feedbackID)
  };

  setEditor = (part) => {
    this.setState({editing: part})
  };

  renderEditor = () => {
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
  };

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
