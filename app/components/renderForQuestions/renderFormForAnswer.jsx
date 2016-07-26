import React from 'react'
import { Link } from 'react-router'
import handleFocus from './handleFocus.js'
import Textarea from 'react-textarea-autosize';

export default React.createClass({

  render: function() {
    console.log("control is reaching here")

    var content = <div />;
    if(this.props.id==="playQuestion") {
      content = <Link to={'/results/questions/' + this.props.questionID} className="button is-info is-outlined">View Results</Link>
    }

    return (
      <section className="section">
        <div className="container">
          {this.props.sentenceFragments}
          <div className="content">
            {this.props.cues}
            {this.props.feedback}
            <div className="control">
              <Textarea className={this.props.textAreaClass} ref="response" onFocus={handleFocus} defaultValue={this.props.initialValue} placeholder="Type your answer here. Rememeber, your answer should be just one sentence." onChange={this.props.handleChange}></Textarea>
            </div>
            <div className="button-group">
              {this.props.nextQuestionButton}
              {content}
            </div>
          </div>
        </div>
      </section>
    )
  }
})
