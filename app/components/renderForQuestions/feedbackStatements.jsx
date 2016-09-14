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
      components = components.concat([(<p dangerouslySetInnerHTML={{__html: data.attempt.response.feedback}}></p>)])
    }
    var errorComponents = _.values(_.mapObject(errors, (val, key) => {
      if (val) {
        return (<p>{feedbackStrings[key]}</p>)
      }
    }))
    // console.log("data.getQuestion.responses: ", data.getQuestion().responses) //returns this.props.question
    if (data.attempt.response.parentID && (data.getQuestion().responses[data.attempt.response.parentID] && data.getQuestion().responses[data.attempt.response.parentID].optimal !== true )) {
      const parentResponse = data.getQuestion().responses[data.attempt.response.parentID]
      components = [(<p dangerouslySetInnerHTML={{__html: parentResponse.feedback}}></p>)].concat(components)
    }
    return components.concat(errorComponents)
  },

  render: function () {
    return (
      <span>{this.renderFeedbackStatements()}</span>
    )
  }

})
