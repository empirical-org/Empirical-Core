import React from 'react';
import {Link} from 'react-router'
import ConceptSelector from 'react-select-search'

const sentenceFragmentForm = React.createClass({

  getInitialState: function () {
    const fragment = this.props.data
    if(fragment===undefined) { //creating new fragment
      return {
        prompt: "Is this a sentence?",
        questionText: "",
        isFragment: false,
        optimalResponseText: "",
        needsIdentification: true,
        conceptID: ""
      }
    } else {
      return {
        prompt: fragment.prompt,
        questionText: fragment.questionText,
        isFragment: fragment.isFragment,
        optimalResponseText: fragment.optimalResponseText!==undefined ? fragment.optimalResponseText : "",
        needsIdentification: fragment.needsIdentification!==undefined ? fragment.needsIdentification : true,
        conceptID: fragment.conceptID
      }
    }
  },

  handleChange: function (key, e) {
    switch (key) {
      case 'prompt':
        this.setState({prompt: e.target.value})
        break;
      case 'questionText':
        this.setState({questionText: e.target.value})
        break;
      case 'optimalResponseText':
        this.setState({optimalResponseText: e.target.value})
        break;
      case 'isFragment':
        this.setState({isFragment: e.target.checked})
        break;
      case 'needsIdentification':
        this.setState({needsIdentification: e.target.checked})
        break;
      case 'concept':
        this.setState({conceptID: e.value})
      default:
        return
    }
  },

  submitSentenceFragment: function() {
    const data = this.state
    this.props.submit(data)
  },

  conceptsToOptions: function() {
    return _.map(this.props.concepts.data["0"], (concept)=>{
      return (
        {name: concept.displayName, value: concept.uid}
      )
    })
  },

  renderOptimalResponseTextInput: function () {
      return (
        [
          (<label className="label">Optimal Answer Text (The most obvious short answer, you can add more later)</label>),
          (<p className="control">
            <input className="input" type="text" value={this.state.optimalResponseText} onChange={this.handleChange.bind(null, "optimalResponseText")}></input>
          </p>)
        ]
      )
  },

  render: function () {
    console.log("State: ", this.state)
    return (
      <div>
        <label className="label">Sentence / Fragment Text</label>
        <p className="control">
          <input className="input" type="text" value={this.state.questionText} onChange={this.handleChange.bind(null, "questionText")}></input>
        </p>
        <p className="control">
          <label className="checkbox">
            <input type="checkbox" checked={this.state.isFragment} onClick={this.handleChange.bind(null, "isFragment")}/>
            This is a fragment.
          </label>
        </p>
        <p className="control">
          <label className="checkbox">
            <input type="checkbox" checked={this.state.needsIdentification} onClick={this.handleChange.bind(null, "needsIdentification")}/>
            Show a multiple choice question to identify sentence or fragment.
          </label>
        </p>
        {this.renderOptimalResponseTextInput()}
        <p className="control">
          <label className="label">Associated Concept</label>
          <ConceptSelector options={this.conceptsToOptions()} value={this.state.concept} onChange={this.handleChange.bind(null, "concept")}/>
        </p>
        <button className="button is-primary is-outlined" onClick={this.submitSentenceFragment}>Save</button>
      </div>
    )
  }
})

export default sentenceFragmentForm
