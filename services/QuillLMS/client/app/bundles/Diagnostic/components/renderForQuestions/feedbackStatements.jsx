import React from 'react';
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
