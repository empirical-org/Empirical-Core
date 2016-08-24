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
      response: "",
    }
  },

  choosingSentenceOrFragment: function () {
    const {question} = this.props;
    return question.identified === undefined && (question.needsIdentification===undefined || question.needsIdentification===true);
    // the case for question.needsIdentification===undefined is for sentenceFragments that were created before the needsIdentification field was put in
  },

  showNextQuestionButton: function () {
    const {question} = this.props;
    const attempted = question.attempts.length > 0
    if (attempted) {
      return true
    } else {
      return false
    }
  },

  getQuestion: function() {
    return this.props.question.questionText
  },

  checkChoice: function(choice) {
    const questionType = this.props.question.isFragment ? "Fragment" : "Sentence"
    this.props.markIdentify(choice === questionType)
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
    const fragment = this.props.sentenceFragments.data[key]

    const responseMatcher = new POSMatcher(fragment.responses);
    const matched = responseMatcher.checkMatch(this.state.response);

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
        if (matched.response.optimal) {
          newResponse.optimal = matched.response.optimal
        }
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
    this.props.updateAttempts(matched);
    // if((matched.posMatch || matched.exactMatch) && matched.response.optimal) {
    //   this.setState({
    //     prompt: "That is a correct answer!",
    //     goToNext: true
    //   })
    // } else {
    //   this.setState({prompt: "Try writing the sentence in another way."})
    // }
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
    }
  },

  renderSentenceOrFragmentMode: function() {
    if (this.choosingSentenceOrFragment()) {
      return (
        <div className="container">
          <ReactTransition transitionName={"sentence-fragment-buttons"} transitionLeave={true} transitionLeaveTimeout={2000}>
            <h5 className="title is-5">Is this a complete or an incomplete sentence?</h5>
            {this.getSentenceOrFragmentButtons()}
          </ReactTransition>
        </div>
      )
    } else {
      return (<div></div>)
    }
  },

  renderPlaySentenceFragmentMode: function() {
    var button
    if(this.showNextQuestionButton()) {
      button = <button className="button is-warning" onClick={this.props.nextQuestion}>Next</button>
    } else {
      button = <button className="button is-primary" onClick={this.checkAnswer}>Submit</button>
    }
    if(!this.choosingSentenceOrFragment() && !this.showNextQuestionButton()) {
      return (
        <div className="container">
          <ReactTransition transitionName={"text-editor"} transitionAppear={true} transitionAppearTimeout={1200} >
            <h5 className="title is-5">Add punctuation and capitalization. If the sentence is incomplete, turn it into to a complete sentence.</h5>
            <TextEditor handleChange={this.handleChange}/>
            <div className="question-button-group">
              {button}
            </div>
          </ReactTransition>
        </div>
      )
    } else if(this.showNextQuestionButton()) {
      return (
        <div>{button}</div>
      )
    } else {
      return (<div />)
    }
  },

  render: function() {
    if(this.props.sentenceFragments.hasreceiveddata) {
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
