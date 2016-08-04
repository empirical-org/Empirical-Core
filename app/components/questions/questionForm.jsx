import React from 'react'
import TextEditor from './textEditor.jsx';
import {hashToCollection} from '../../libs/hashToCollection'
import _ from 'lodash'

export default React.createClass({
  getInitialState: function () {
    return {
      prompt: "",
      itemLevel: this.props.question.itemLevel ? this.props.question.itemLevel : ""
    }
  },

  submit: function () {
    this.props.submit({
      prompt: this.state.prompt,
      prefilledText: this.refs.prefilledText.value,
      cues: this.refs.cues.value.split(','),
      itemLevel: this.state.itemLevel
    })
  },

  handlePromptChange: function (e) {
    this.setState({prompt: e})
  },

  handleLevelChange: function(e) {
    this.setState({itemLevel: this.refs.itemLevel.value})
  },

  itemLevelToOptions: function() {
    return hashToCollection(this.props.itemLevels.data).filter((itemLevel) => {
      return itemLevel.conceptID===this.props.question.conceptID //we only want those itemLevels associated with the current concept
    }).map((level) => {
      return (
        <option>{level.name}</option>
      )
    })
  },

  render: function () {
    console.log("inside questionForm.jsx, props: ", this.props)
    console.log("inside questionForm.jsx, state: ", this.state)
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
        <label className="label">Item level</label>
        <p className="control">
          <span className="select">
            <select onChange={this.handleLevelChange} ref="itemLevel" value={this.state.itemLevel}>
              <option>Select Item Level</option>
              {this.itemLevelToOptions()}
            </select>
          </span>
        </p>
        <button className="button is-primary" onClick={this.submit}>Update Question</button>
      </div>
    )
  }
})
