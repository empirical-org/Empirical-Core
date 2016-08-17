import React from 'react'
import TextEditor from './textEditor.jsx';
import {hashToCollection} from '../../libs/hashToCollection'
import _ from 'lodash'
import ConceptSelector from 'react-select-search'
// import ConceptSelector from 'react-selectize'.SimpleSelect
// var SimpleSelect = require("react-selectize").SimpleSelect

export default React.createClass({
  getInitialState: function () {
    return {
      prompt: "",
      itemLevel: this.props.question.itemLevel ? this.props.question.itemLevel : "",
      concept: this.props.question.conceptID
    }
  },

  submit: function () {

    this.props.submit({
      prompt: this.state.prompt,
      prefilledText: this.refs.prefilledText.value,
      cues: this.refs.cues.value.split(','),
      itemLevel: this.state.itemLevel,
      conceptID: this.state.concept
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

  handleSelectorChange: function(e) {
    this.setState({concept: e.name})
  },

  handleConceptChange: function() {
    this.setState({concept: this.refs.concept.value})
  },

  conceptsToOptions: function() {
    return _.map(this.props.concepts.data["0"], (concept)=>{
      return (
        {name: concept.name, value: concept.uid}
      )
    })
  },

  render: function () {
    if(this.props.concepts.hasreceiveddata) {
      console.log("State: ", this.state)
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
          <label className="label">Concept</label>
          <div>
            <ConceptSelector options={this.conceptsToOptions()} placeholder={this.state.concept} onChange={this.handleSelectorChange}/>
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
// <ConceptSelector options={[{label: "1", value: "1"}, {label: "2", value: "2"}]} placeholder="Select a concept" />
// <p className="control">
//   <span className="select">
//     <select onChange={this.handleConceptChange} ref="concept" value={this.state.concept}>
//       <option>Select Concept</option>
//       {this.conceptsToOptions()}
//     </select>
//   </span>
// </p>

// <SimpleSelect theme="material" options={options} placeholder="Select a concept" filterOptions={(e)=>{this.filterOptions(options, e)}} className="selector" onValueChange={this.handleSelectorChange}>
// </SimpleSelect>
