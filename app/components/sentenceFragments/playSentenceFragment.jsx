import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import TextEditor from '../renderForQuestions/renderTextEditor.jsx'
import _ from 'underscore'
import ReactTransition from 'react-addons-css-transition-group'
import POSMatcher from '../../libs/sentenceFragment.js'

var PlaySentenceFragment = React.createClass({
  getInitialState: function() {
    return {
      choosingSentenceOrFragment: true,
      prompt: "Is this a sentence or a fragment?",
      response: ""
    }
  },

  getQuestion: function() {
    return this.props.sentenceFragments.data[this.props.params.fragmentID].questionText
  },

  checkChoice: function(choice) {
    const questionType = this.props.sentenceFragments.data[this.props.params.fragmentID].isFragment ? "Fragment" : "Sentence"
    if(choice===questionType) {
      this.setState({prompt: "Well done! You identified correctly!"})
      //timeout below to allow for constructive feedback to stay on the screen for longer
      setTimeout(()=>{
        this.setState({
          choosingSentenceOrFragment: false,
          prompt: "Add and/or change as few words as you can to turn this fragment into a sentence"
        })}, 4000)
    } else {
      this.setState({
        prompt: "Look closely. Do all the necessary the parts of speech (subject, verb) exist?"
      })
    }
  },

  getSentenceOrFragmentButtons() {
    return (
      <div className="button-group">
        <button className="button is-primary" value="Sentence" onClick={() => {this.checkChoice("Sentence")}}>Sentence</button>
        <button className="button is-info" value="Fragment" onClick={() => {this.checkChoice("Fragment")}}>Fragment</button>
      </div>
    )
  },

  handleChange: function(e) {
    this.setState({response: e})
  },

  checkAnswer: function() {
    const fragment = this.props.sentenceFragments.data[this.props.params.fragmentID]
    const optimalResponses = _.filter(fragment.responses, (response)=>{
      return response.optimal===true
    })

    const responseMatcher = new POSMatcher(optimalResponses);
    const matched = responseMatcher.checkMatch(this.state.response);

    if(matched.posMatch || matched.exactMatch) {
      this.setState({prompt: "That is a correct answer!"})
    } else {
      this.setState({prompt: "We have not seen that response before. Try writing the sentence in another way."})
    }
  },

  renderSentenceOrFragmentMode: function() {
    if(this.state.choosingSentenceOrFragment) {
      return (
        <div className="container">
          <ReactTransition transitionName={"sentence-fragment-buttons"} transitionLeave={true} transitionLeaveTimeout={2000}>
            <h5 className="title is-5">{this.state.prompt}</h5>
            {this.getSentenceOrFragmentButtons()}
          </ReactTransition>
        </div>
      )
    } else {
        return <div />
    }
  },

  renderPlaySentenceFragmentMode: function() {
    if(!this.state.choosingSentenceOrFragment && this.props.sentenceFragments.data[this.props.params.fragmentID].isFragment) {
      return (
        <div className="container">
          <ReactTransition transitionName={"text-editor"} transitionAppear={true} transitionAppearTimeout={2000} >
            <h5 className="title is-5">{this.state.prompt}</h5>
            <TextEditor handleChange={this.handleChange}/>
            <div className="question-button-group">
              <button className="button is-primary" onClick={this.checkAnswer}>Check Answer</button>
            </div>
          </ReactTransition>
        </div>
      )
    } else {
      return <div />
    }
  },

  render: function() {
    if(this.props.sentenceFragments.hasreceiveddata) {
      const fragment = this.props.sentenceFragments.data[this.props.params.fragmentID]
      return (
        <div className="section container">
          <p className="sentence-fragments">{this.getQuestion()}</p>
          {this.renderSentenceOrFragmentMode()}
          {this.renderPlaySentenceFragmentMode()}
        </div>
      )
    } else {
      return (<div className="container">Loading...</div>)
    }
  }
})

function select(state) {
  return {
    routing: state.routing,
    sentenceFragments: state.sentenceFragments
  }
}

export default connect(select)(PlaySentenceFragment)
