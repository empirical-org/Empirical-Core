import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import TextEditor from '../renderForQuestions/renderTextEditor.jsx'
import _ from 'underscore'
import ReactTransition from 'react-addons-css-transition-group'
import POSMatcher from '../../libs/sentenceFragment.js'
import fragmentActions from '../../actions/sentenceFragments.js'

var key = "" //enables this component to be used by both play/sentence-fragments and play/diagnostic

var PlaySentenceFragment = React.createClass({
  getInitialState: function() {
    return {
      choosingSentenceOrFragment: true,
      prompt: "Is this a sentence or a fragment?",
      response: "",
      goToNext: false,
      isNextPage: false
    }
  },

  getQuestion: function() {
    return this.props.sentenceFragments.data[key].questionText
  },

  checkChoice: function(choice) {
    const questionType = this.props.sentenceFragments.data[key].isFragment ? "Fragment" : "Sentence"
    if(choice===questionType) {
      this.setState({prompt: "Well done! You identified correctly!"})
      //timeout below to allow for constructive feedback to stay on the screen for longer
      setTimeout(()=>{
        this.setState({
          choosingSentenceOrFragment: false,
          prompt: "Add and/or change as few words as you can to turn this fragment into a sentence"
        })}, 250)
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
    const fragment = this.props.sentenceFragments.data[key]

    const responseMatcher = new POSMatcher(fragment.responses);
    const matched = responseMatcher.checkMatch(this.state.response); //matched only checks against optimal responses

    var newResponse;

    console.log("Matched: ", matched)

    if(matched.found) {
      if(matched.posMatch && !matched.exactMatch) {
        newResponse = {
          text: matched.submitted,
          parentID: matched.response.key,
          count: 1,
          feedback: matched.response.optimal ? "Excellent!" : "Try writing the sentence in another way."
        }
        if(matched.response.optimal) newResponse.optimal = matched.response.optimal
        this.props.dispatch(fragmentActions.submitNewResponse(key, newResponse))
        this.props.dispatch(fragmentActions.incrementChildResponseCount(key, matched.response.key)) //parent has no parentID
      } else {
        this.props.dispatch(fragmentActions.incrementResponseCount(key, matched.response.key, matched.response.parentID))
      }
    } else {
      newResponse = {
        text: matched.submitted,
        count: 1
      }
      this.props.dispatch(fragmentActions.submitNewResponse(key, newResponse))
    }

    if((matched.posMatch || matched.exactMatch) && matched.response.optimal) {
      this.setState({
        prompt: "That is a correct answer!",
        goToNext: true
      })
    }
    else {
      this.setState({prompt: "Try writing the sentence in another way."})
    }
  },

  renderNextPage: function() {
    if(!this.props.currentKey) {
      if(this.state.isNextPage) {
        return (
          <div className="container">
            <h5 className="title is-5">Thank you for playing!</h5>
          </div>
        )
      }
    } else if(this.state.isNextPage) {
      this.props.nextQuestion()
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
    var button
    if(this.state.goToNext) {
      button = <button className="button is-warning" onClick={() => {this.setState({isNextPage: true})}}>Next</button>
    } else {
      button = button = <button className="button is-primary" onClick={this.checkAnswer}>Check Answer</button>
    }
    if(!this.state.choosingSentenceOrFragment && this.props.sentenceFragments.data[key].isFragment && !this.state.isNextPage) {
      return (
        <div className="container">
          <ReactTransition transitionName={"text-editor"} transitionAppear={true} transitionAppearTimeout={2000} >
            <h5 className="title is-5">{this.state.prompt}</h5>
            <TextEditor handleChange={this.handleChange}/>
            <div className="question-button-group">
              {button}
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
      console.log("Inside playSentenceFragment render: ", this.props)
      key = this.props.params ? this.props.params.fragmentID : this.props.currentKey
      const fragment = this.props.sentenceFragments.data[key]
      return (
        <div className="section container">
          <p className="sentence-fragments">{this.getQuestion()}</p>
          {this.renderSentenceOrFragmentMode()}
          {this.renderPlaySentenceFragmentMode()}
          {this.renderNextPage()}
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
