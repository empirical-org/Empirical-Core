import React from 'react'
import TextEditor from './textEditor.jsx';

export default React.createClass({
  getInitialState: function () {
    return {
      prompt: ""
    }
  },

  submit: function () {
    this.props.submit({
      prompt: this.state.prompt,
      prefilledText: this.refs.prefilledText.value,
      cues: this.refs.cues.value.split(',')
    })
  },

  handlePromptChange: function (e) {
    this.setState({prompt: e})
  },

  render: function () {
    return (
      <div className="box">
        <h6 className="control subtitle">Create a new question</h6>
        <label className="label">Prompt</label>
        <TextEditor text={this.props.question.prompt || ""} handleTextChange={this.handlePromptChange}/>
        <label className="label">Cues (separated by commas, no spaces eg "however,therefore,hence")</label>
        <p className="control">
          <input className="input" type="text" ref="cues" defaultValue={this.props.question.cues}></input>
        </p>
        <label className="label">Prefilled Text (place 5 underscores where you want the user to fill in _____)</label>
        <p className="control">
          <input className="input" type="text" ref="prefilledText" defaultValue={this.props.question.prefilledText}></input>
        </p>
        <button className="button is-primary" onClick={this.submit}>Update Question</button>
      </div>
    )
  }
})
