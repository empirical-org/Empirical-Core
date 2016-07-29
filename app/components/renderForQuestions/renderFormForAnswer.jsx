import React from 'react'
import { Link } from 'react-router'
import handleFocus from './handleFocus.js'
import TextEditor from './renderTextEditor.jsx'

export default React.createClass({

  render: function() {
    var content = <div />;
    if(this.props.id==="playQuestion") {
      content = <Link to={'/results/questions/' + this.props.questionID} className="button is-info is-outlined">View Results</Link>
    }

    var button;
    if(!this.props.nextQuestionButton) {
      button = <button className={"button is-primary " + this.props.toggleDisabled} onClick={this.props.checkAnswer}>Check answer</button>
    } else {
      button = this.props.nextQuestionButton
    }

    return (
      <section className="section">
        <div className="container">
          {this.props.sentenceFragments}
          <div className="content">
            {this.props.cues}
            {this.props.feedback}
            <TextEditor className={this.props.textAreaClass} defaultValue={this.props.initialValue}
                        handleChange={this.props.handleChange} value={this.props.value} latestAttempt={getLatestAttempt(this.props.question.attempts)} getResponse={this.props.getResponse}/>
            <div className="button-group">
              {button}
              {content}
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
