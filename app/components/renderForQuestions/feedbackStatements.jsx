import React from 'react'
import _ from 'underscore'
var C = require("../../constants").default

const feedbackStrings = C.FEEDBACK_STRINGS

export default React.createClass({

  renderFeedbackStatements: function () {
    const data = this.props
    const errors = data.getErrorsForAttempt(data.attempt);
    var components = []
    var errorComponents = []
    if (_.isEmpty(errors)) {
      components = components.concat([(<p dangerouslySetInnerHTML={{__html: data.attempt.response.feedback}}></p>)])
    } else {
      errorComponents = errorComponents.concat([(<p dangerouslySetInnerHTML={{__html: data.attempt.feedback}}></p>)])
    }
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
