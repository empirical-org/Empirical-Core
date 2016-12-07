import React, { Component } from 'react';
import { connect } from 'react-redux';
import SentenceFragmentTemplate from '../sentenceFragments/sentenceFragmentTemplateComponent.jsx';

class PlaySentenceFragment extends Component {
  constructor(props) {
    super();
    this.handleAttemptSubmission = this.handleAttemptSubmission.bind(this);
  }

  handleAttemptSubmission() {
    this.props.nextQuestion();
  }

  render() {
    return (
      <SentenceFragmentTemplate {...this.props} handleAttemptSubmission={this.handleAttemptSubmission} />
    );
  }
}

function select(state) {
  return {
    routing: state.routing,
    sentenceFragments: state.sentenceFragments,
    responses: state.responses,
  };
}

export default connect(select)(PlaySentenceFragment);
