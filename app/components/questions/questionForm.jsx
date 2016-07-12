import React from 'react'

export default React.createClass({
  submit: function () {
    this.props.submit({
      prompt: this.refs.prompt.value,
      prefilledText: this.refs.prefilledText.value,
      cues: this.refs.cues.value.split(',')
    })
  },

  render: function () {
    return (
      <div className="box">
        <h6 className="control subtitle">Create a new question</h6>
        <label className="label">Prompt</label>
        <p className="control">
          <input className="input" type="text" ref="prompt" defaultValue={this.props.question.prompt}></input>
        </p>
        <label className="label">Cues (seperated by commas, no spaces eg "however,therefore,hence")</label>
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
