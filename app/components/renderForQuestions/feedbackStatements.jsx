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
    return components.concat(errorComponents)
  },

  render: function () {
    return (
      <span>{this.renderFeedbackStatements()}</span>
    )
  }

})
