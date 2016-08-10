import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import TextEditor from '../renderForQuestions/renderTextEditor.jsx'
import _ from 'underscore'
import ReactTransition from 'react-addons-css-transition-group'

var PlaySentenceFragment = React.createClass({

  getInitialState: function() {
    return {
      choosingSentenceOrFragment: true,
      questionType: "Fragment",
      prompt: "Is this a sentence or a fragment?",
      optimalResponses: ["I like New York for it has pizza.", "I like New York because it has pizza", "I like New York pizza."],
      response: ""
    }
  },

  getQuestion: function() {
    return "I New York pizza."
  },

  checkChoice: function(choice) {
    if(choice===this.state.questionType) {
      this.setState({prompt: "Well done! Maybe add more constructive feedback here? Can also add a button to continue."})
      //timeout below to allow for constructive feedback to stay on the screen for longer
      setTimeout(()=>{
        this.setState({
          choosingSentenceOrFragment: false,
          prompt: "Add and/or change as few words as you can to turn this fragment into a sentence"
        })}, 1000)
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

  renderSentenceOrFragmentMode: function() {
    if(this.state.choosingSentenceOrFragment) {
      return (
        <div>
          <h5 className="title is-5">{this.state.prompt}</h5>
          {this.getSentenceOrFragmentButtons()}
        </div>
      )
    } else {
      return <div />
    }
  },

  handleChange: function(e) {
    this.setState({response: e})
  },

  checkAnswer: function() {
    const found = _.find(this.state.optimalResponses, (optimalResponse)=>{
      return this.state.response.trim().replace(/\s{2,}/g, ' ')===optimalResponse
    })

    if(found) {
      this.setState({prompt: "That is a correct answer!"})
    } else {
      this.setState({prompt: "We have not seen that response before. Try writing the sentence in another way."})
    }
  },

  renderPlaySentenceFragmentMode: function() {
    if(!this.state.choosingSentenceOrFragment && this.state.questionType==="Fragment") {
      return (
        <div className="container">
          <h5 className="title is-5">{this.state.prompt}</h5>
          <ReactTransition transitionName={"text-editor"} transitionAppear={true} transitionAppearTimeout={3000}>
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
    return (
      <div className="section container">
        <p className="sentence-fragments">{this.getQuestion()}</p>
        {this.renderSentenceOrFragmentMode()}
        {this.renderPlaySentenceFragmentMode()}
      </div>
    )
  }
})


function select(state) {
  return {
    routing: state.routing
  }
}

export default connect(select)(PlaySentenceFragment)
