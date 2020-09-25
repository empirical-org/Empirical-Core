import React from 'react';
import _ from 'underscore';

const C = require('../../constants').default;

const feedbackStrings = C.FEEDBACK_STRINGS;

export default class extends React.Component {
  renderFeedbackStatements = () => {
    return (<p dangerouslySetInnerHTML={{ __html: this.props.attempt.response.feedback, }} />);
  };

  render() {
    return (
      <span>{this.renderFeedbackStatements()}</span>
    );
  }
}
