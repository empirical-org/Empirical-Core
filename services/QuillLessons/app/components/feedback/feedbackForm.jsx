import React from 'react'
import actions from '../../actions/concepts-feedback'
import feedbackActions from '../../actions/concepts-feedback'
import { connect } from 'react-redux'
import TextEditor from '../questions/textEditor.jsx'
import { ConceptExplanation } from 'quill-component-library/dist/componentLibrary'
export default React.createClass ({

  // propTypes: {
  //   // feedbackText: React.PropTypes.string.isRequired,
  //   // feedbackID: React.PropTypes.string.isRequired,
  //   // submitNewFeedback: React.PropTypes.func.isRequired,
  //   // cancelEdit: React.PropTypes.func.isRequired
  // },

  getInitialState: function() {
    return {
      description: this.props.description,
      leftBox: this.props.leftBox,
      rightBox: this.props.rightBox,
      editing: "title"
    };
  },

  handleChange: function (key, e) {
    const newState = {}
    newState[key] = e;
    this.setState(newState)
  },

  submit: function(e){
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
  },

  cancel: function() {
    this.props.cancelEdit(this.props.feedbackID)
  },

  setEditor: function (part) {
    this.setState({editing: part})
  },

  renderEditor: function () {
    const parts = ["description", "leftBox", "rightBox"];
    return parts.map((part) => {
      if (part === this.state.editing) {
        return [
          (<label className="label">{part}</label>),
          (<TextEditor text={this.state[part]} handleTextChange={this.handleChange.bind(null, part)} key={part}/>)
        ]
      } else {
        return [
          (<label className="label">{part}</label>),
          (<div>{this.state[part]}</div>),
          (<a onClick={this.setEditor.bind(null, part)}>Edit</a>)
        ]
      }

    })
  },

  render: function () {
    return (
      <div>
        <form className="box" onSubmit={this.submit}>
          {this.renderEditor()}
          {/*<label className="label">Title</label>
          <TextEditor text={this.state.title} handleTextChange={this.handleChange.bind(null, "title")} key="title"/>
          <label className="label">Description</label>
          <TextEditor text={this.state.description} handleTextChange={this.handleChange.bind(null, "description")} key="description"/>
          <label className="label">Left Box</label>
          <TextEditor text={this.state.leftBox} handleTextChange={this.handleChange.bind(null, "leftBox")} key="leftBox"/>
          <label className="label">Right Box</label>
          <TextEditor text={this.state.rightBox} handleTextChange={this.handleChange.bind(null, "rightBox")} key="rightBox"/>
          <label className="label">Remember To</label>
          <TextEditor text={this.state.rememberTo} handleTextChange={this.handleChange.bind(null, "rememberTo")} key="rememberTo"/>*/}
          <br />
          <button type="submit" className="button is-primary">Submit</button>
          <button className="button is-danger" onClick={this.cancel}>Cancel</button>
        </form>
        <ConceptExplanation {...this.state}/>
      </div>

    )
  }

})
