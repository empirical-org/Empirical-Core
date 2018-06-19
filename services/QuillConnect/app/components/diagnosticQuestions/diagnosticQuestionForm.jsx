import React from 'react'
import TextEditor from '../questions/textEditor.jsx';
import {hashToCollection} from '../../libs/hashToCollection'
import _ from 'lodash'
import ConceptSelector from '../shared/conceptSelector.jsx'
import FlagDropdown from '../shared/flagDropdown.jsx';

const diagnosticQuestionForm = React.createClass({
  getInitialState: function () {
    const question = this.props.question;
    if (question === undefined) {
      return {
        prompt: '',
        itemLevel: 'Select Item Level',
        concept: '',
        instructions: '',
        prefilledText: '',
        cues: '',
        flag: 'alpha',
        cuesLabel: ''
      }
    }
    return {
      prompt: question.prompt ? question.prompt : '',
      itemLevel: question.itemLevel ? question.itemLevel : '',
      concept: question.conceptID,
      instructions: question.instructions ? question.instructions : '',
      prefilledText: question.prefilledText? question.prefilledText : '',
      cues: question.cues? question.cues : '',
      flag: question.flag ? question.flag : 'alpha',
      cuesLabel: question.cuesLabel ? question.cuesLabel : ''
    }
  },

  submit: function () {
    this.props.submit({
      prompt: this.state.prompt,
      prefilledText: this.refs.prefilledText.value,
      cues: this.refs.cues.value.split(','),
      itemLevel: this.state.itemLevel,
      conceptID: this.state.concept,
      instructions: this.state.instructions,
      flag: this.state.flag,
      cuesLabel: this.state.cuesLabel
    })
  },

  handlePromptChange: function (e) {
    this.setState({prompt: e})
  },

  handleLevelChange: function(e) {
    this.setState({itemLevel: this.refs.itemLevel.value})
  },

  handleInstructionsChange: function(e) {
    this.setState({instructions: e.target.value})
  },

  itemLevelToOptions: function() {
    return hashToCollection(this.props.itemLevels.data).map((level) => {
      return (
        <option>{level.name}</option>
      )
    })
  },

  handleSelectorChange: function(e) {
    this.setState({concept: e.value})
  },

  handleFlagChange(e) {
    this.setState({ flag: e.target.value, });
  },

  handleCuesLabelChange: function(e) {
    this.setState({ cuesLabel: e.target.value, });
  },

  render: function () {
    return (
      <div className="box">
        <h6 className="control subtitle">Create a new question</h6>
        <label className="label">Prompt</label>
        <TextEditor text={this.state.prompt || ""} handleTextChange={this.handlePromptChange}/>
        <label className="label">Instructions for student</label>
        <p className="control">
          <textarea className="input" type="text" ref="instructions" defaultValue={this.state.instructions} onChange={this.handleInstructionsChange}></textarea>
        </p>
        <label className="label">Cues Label (default is "joining words" for multiple cues and "joining word" for single cues)</label>
        <p className="control">
          <input className="input" type="text" onChange={this.handleCuesLabelChange} defaultValue={this.props.question.cuesLabel}></input>
        </p>
        <label className="label">Cues (separated by commas, no spaces eg "however,therefore,hence")</label>
        <p className="control">
          <input className="input" type="text" ref="cues" defaultValue={this.state.cues}></input>
        </p>
        <label className="label">Prefilled Text (place 5 underscores where you want the user to fill in _____)</label>
        <p className="control">
          <input className="input" type="text" ref="prefilledText" defaultValue={this.state.prefilledText}></input>
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
        <FlagDropdown flag={this.state.flag} handleFlagChange={this.handleFlagChange} isLessons={false}/>
        <label className="label">Concept</label>
        <div>
          <ConceptSelector currentConceptUID={this.state.concept}
            handleSelectorChange={this.handleSelectorChange}/>
        </div>
        <br/>
        <button className="button is-primary" onClick={this.submit}>Save Question</button>
      </div>
    )
  }
});

export default diagnosticQuestionForm;
