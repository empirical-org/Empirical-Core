import React from 'react'

export default React.createClass({
  submit: function () {
    this.props.submit({prompt: this.refs.prompt.value})
  },

  render: function () {
    return (
      <div className="box">
        <h6 className="control subtitle">Create a new question</h6>
        <label className="label">Prompt</label>
        <p className="control">
          <input className="input" type="text" ref="prompt" defaultValue={this.props.question.prompt}></input>
        </p>
        <button className="button is-primary" onClick={this.submit}>Update Question</button>
      </div>
    )
  }
})
