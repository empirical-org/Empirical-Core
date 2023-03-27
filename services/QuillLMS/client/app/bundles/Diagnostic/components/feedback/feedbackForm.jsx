import { ContentState, EditorState } from 'draft-js'
import * as React from 'react'
import {
    ConceptExplanation, TextEditor
} from '../../../Shared/index'
export default class FeedbackForm extends React.Component {
  constructor(props) {
    super(props)

    const { description, leftBox, rightBox } = props

    this.state = {
      description: description || '',
      leftBox: leftBox || '',
      rightBox: rightBox || '',
      editing: "title"
    }
  }

  handleChange = (key, e) => {
    const newState = {}
    newState[key] = e;
    this.setState(newState)
  };

  submit = (e) => {
    e.preventDefault();
    const { feedbackID, submitNewFeedback } = this.props;
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
    submitNewFeedback(feedbackID, data)
  };

  cancel = () => {
    const { cancelEdit, feedbackID } = this.props;
    cancelEdit(feedbackID)
  };

  setEditor = (part) => {
    this.setState({editing: part})
  };

  renderEditor = () => {
    const { editing } = this.state
    const parts = ["description", "leftBox", "rightBox"];
    return parts.map((part) => {
      if (part === editing) {
        return(
          <React.Fragment>
            <label className="label">{part}</label>
            <TextEditor
              ContentState={ContentState}
              EditorState={EditorState}
              handleTextChange={(e) => this.handleChange(part, e)}
              key={part}
              text={this.state[part]}
            />
          </React.Fragment>
        )
      } else {
        return(
          <React.Fragment>
            <label className="label">{part}</label>
            <div>{this.state[part]}</div>
            <a onClick={() => this.setEditor(part)}>Edit</a>
          </React.Fragment>
        )
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
