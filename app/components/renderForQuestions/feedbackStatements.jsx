import React from 'react'
import _ from 'underscore'
var C = require("../../constants").default
/*
  21 Test the changes
*/

const feedbackStrings = C.FEEDBACK_STRINGS

export default React.createClass({

  renderFeedbackStatements: function () {
    const data = this.props
    const errors = data.getErrorsForAttempt(data.attempt);
    // add keys for react list elements
    var components = []
    if (_.isEmpty(errors)) {
      components = components.concat([(<li key="feedback" dangerouslySetInnerHTML={{__html: data.attempt.response.feedback}}></li>)])
    }
    var errorComponents = _.values(_.mapObject(errors, (val, key) => {
      if (val) {
        return (<li key={key}><h5 className="title is-5">{feedbackStrings[key]}.</h5></li>)
      }
    }))
    // console.log("data.getQuestion.responses: ", data.getQuestion().responses) //returns this.props.question
    if (data.attempt.response.parentID && (data.getQuestion().responses[data.attempt.response.parentID] && data.getQuestion().responses[data.attempt.response.parentID].optimal !== true )) {
      const parentResponse = data.getQuestion().responses[data.attempt.response.parentID]
      components = [(<li key="parentfeedback" dangerouslySetInnerHTML={{__html: parentResponse.feedback}}></li>)].concat(components)
    }
    return components.concat(errorComponents)
  },

  render: function() {
    return <div>{this.renderFeedbackStatements()}</div>
  }

})
