import React from 'react'
import TextEditor from './textEditor.jsx';
import {hashToCollection} from '../../libs/hashToCollection'
import _ from 'lodash'
import ConceptSelector from 'react-select-search'

export default React.createClass({
  getInitialState: function () {
    return {
      prompt: "",
      itemLevel: this.props.question.itemLevel ? this.props.question.itemLevel : "",
      concept: this.props.question.conceptID,
      instructions: this.props.question.instructions ? this.props.question.instructions : ""
    }
  },

  submit: function () {

    this.props.submit({
      prompt: this.state.prompt,
      prefilledText: this.refs.prefilledText.value,
      cues: this.refs.cues.value.split(','),
      itemLevel: this.state.itemLevel,
      conceptID: this.state.concept,
      instructions: this.state.instructions
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

  handleConceptChange: function() {
    this.setState({concept: this.refs.concept.value})
  },

  conceptsToOptions: function() {
    return _.map(this.props.concepts.data["0"], (concept)=>{
      return (
        {name: concept.displayName, value: concept.uid, shortenedName: concept.name}
      )
    })
  },

  renderSelector: function() {
    const fuse = {
      keys: ['shortenedName', 'name'], //first search by specific concept, then by parent and grandparent
      threshold: 0.4
    }
    const existingConcept = _.find(this.props.concepts.data["0"], {uid: this.state.concept})
    const placeholder = existingConcept===undefined ? "" : existingConcept.displayName
    return (
      <ConceptSelector options={this.conceptsToOptions()} placeholder={placeholder}
                       onChange={this.handleSelectorChange} fuse={fuse}/>
    )
  },

  render: function () {
    if(this.props.concepts.hasreceiveddata) {
      return (
        <div className="box">
          <h6 className="control subtitle">Create a new question</h6>
          <label className="label">Prompt</label>
          <TextEditor text={this.props.question.prompt || ""} handleTextChange={this.handlePromptChange}/>
          <label className="label">Instructions for student</label>
          <p className="control">
            <input className="input" type="text" ref="instructions" defaultValue={this.props.question.instructions} onChange={this.handleInstructionsChange}></input>
          </p>
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
          <label className="label">Concept</label>
          <div>
            {this.renderSelector()}
          </div>
          <br/>
          <button className="button is-primary" onClick={this.submit}>Update Question</button>
        </div>
      )
    } else {
      return (<div>Loading...</div>)
    }
  }
})
