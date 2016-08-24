import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import TextEditor from '../renderForQuestions/renderTextEditor.jsx'
import _ from 'underscore'
import ReactTransition from 'react-addons-css-transition-group'
import POSMatcher from '../../libs/sentenceFragment.js'
import fragmentActions from '../../actions/sentenceFragments.js'

var PlaySentenceFragment = React.createClass({
  getInitialState: function() {
    return {
      choosingSentenceOrFragment: true,
      prompt: "Is this a complete or an incomplete sentence?",
      response: "",
      goToNext: false,
      isNextPage: false
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
          prompt: "Add and/or change as few words as you can to make this a complete sentence."
        })}, 750)
    } else {
      this.setState({
        prompt: "Look closely. Do all the necessary the parts of speech (subject, verb) exist?"
      })
    }
  },

  getSentenceOrFragmentButtons() {
    return (
      <div className="button-group">
        <button className="button is-primary" value="Sentence" onClick={() => {this.checkChoice("Sentence")}}>Complete Sentence</button>
        <button className="button is-info" value="Fragment" onClick={() => {this.checkChoice("Fragment")}}>Incomplete Sentence</button>
      </div>
    )
  },

  handleChange: function(e) {
    this.setState({response: e})
  },

  checkAnswer: function() {
    const fragment = this.props.sentenceFragments.data[this.props.params.fragmentID]

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
        this.props.dispatch(fragmentActions.submitNewResponse(this.props.params.fragmentID, newResponse))
        this.props.dispatch(fragmentActions.incrementChildResponseCount(this.props.params.fragmentID, matched.response.key)) //parent has no parentID
      } else {
        this.props.dispatch(fragmentActions.incrementResponseCount(this.props.params.fragmentID, matched.response.key, matched.response.parentID))
      }
    } else {
      newResponse = {
        text: matched.submitted,
        count: 1
      }
      this.props.dispatch(fragmentActions.submitNewResponse(this.props.params.fragmentID, newResponse))
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
      button = <button className="button is-primary" onClick={this.checkAnswer}>Check Answer</button>
    }
    if(!this.state.choosingSentenceOrFragment && this.props.sentenceFragments.data[this.props.params.fragmentID].isFragment && !this.state.isNextPage) {
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
    } else if(!this.props.sentenceFragments.data[this.props.params.fragmentID].isFragment && !this.state.choosingSentenceOrFragment && !this.state.isNextPage) {
      return (<button className="button is-warning" onClick={() => {this.setState({isNextPage: true})}}>Next</button>)
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
