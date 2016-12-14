import React, { Component } from 'react';
import { connect } from 'react-redux';
import SentenceFragmentTemplate from '../sentenceFragments/sentenceFragmentTemplateComponent.jsx';

class PlaySentenceFragment extends Component {
  constructor(props) {
    super();
    this.state = {
      submitted: false,
    };
    this.handleAttemptSubmission = this.handleAttemptSubmission.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.question !== nextProps.question) {
      return true;
    }
    return false;
  }

  handleAttemptSubmission() {
    if (this.state.submitted === false) {
      this.setState(
        { submitted: true, },
        this.props.nextQuestion()
      );
    }
  }

  render() {
    return (
      <SentenceFragmentTemplate {...this.props} handleAttemptSubmission={this.handleAttemptSubmission} />
    );
  }
}

export default PlaySentenceFragment;
