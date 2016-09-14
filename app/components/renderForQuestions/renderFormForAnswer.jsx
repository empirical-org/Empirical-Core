import React from 'react'
import { Link } from 'react-router'
import handleFocus from './handleFocus.js'
import TextEditor from './renderTextEditor.jsx'
import Modal from '../modal/modal.jsx'
import _ from 'underscore'
import EndState from './renderEndState.jsx'

export default React.createClass({

  getInitialState: function() {
    return ({modalOpen: false})
  },

  getHelpModal: function() {
    if (this.state.modalOpen) {
      return (
        <Modal close={() => {this.setState({modalOpen: false})}}>
          <div className="box">
            <h4 className="title">Hint</h4>
            <iframe src={this.props.assetURL} frameBorder="0" width="960" height="569" allowFullScreen="true"
                    mozallowfullscreen="true" webkitallowfullscreen="true"/>
          </div>
        </Modal>
      )
    }
  },

  render: function() {
    var content;
    // if(this.props.id==="playQuestion") {
    //   content = <Link to={'/results/questions/' + this.props.questionID} className="button is-info is-outlined">View Results</Link>
    // }

    var button, feedback = this.props.feedback;
    if(!this.props.nextQuestionButton) {
      button = <button className={"button student-submit " + this.props.toggleDisabled} onClick={this.props.checkAnswer}>Check answer</button>
    } else { // if you're going to next, it is the end state
      button = this.props.nextQuestionButton
      let answeredCorrectly = !!(_.find(this.props.question.attempts, (attempt) => {
        return attempt.found && attempt.response.optimal && attempt.response.author===undefined && attempt.author===undefined //if it has an author, there was an error
      }))
      feedback = <EndState questionID={this.props.questionID} answeredCorrectly={answeredCorrectly} key={"-"+this.props.questionID}/>
    }

    var info;
    if(!!this.props.assetURL) {
      info = <button className={"button is-outlined is-success"} onClick={() => {this.setState({modalOpen:true})}}>Hint</button>
    }

    return (
      <section className="section is-fullheight minus-nav student">
        <div className="student-container">
          {this.props.sentenceFragments}
          <div className="content">
            {this.props.cues}
            {feedback}
            <TextEditor className={this.props.textAreaClass} defaultValue={this.props.initialValue} key={this.props.questionID}
                        handleChange={this.props.handleChange} value={this.props.value} latestAttempt={getLatestAttempt(this.props.question.attempts)} getResponse={this.props.getResponse}/>
            <div className="question-button-group button-group">
              {this.getHelpModal()}
              {info}
              {content}
              {button}
            </div>
          </div>
        </div>
      </section>
    )
  }
})

const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex]
}

// <div className="control">
//   <Textarea className={this.props.textAreaClass} ref="response" onFocus={handleFocus} defaultValue={this.props.initialValue} placeholder="Type your answer here. Rememeber, your answer should be just one sentence." onChange={this.props.handleChange}></Textarea>
// </div>
