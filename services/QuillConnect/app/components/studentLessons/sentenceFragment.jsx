import React, { Component } from 'react';
import { connect } from 'react-redux';

import SentenceFragmentTemplate from '../sentenceFragments/sentenceFragmentTemplateComponentML';

class PlaySentenceFragment extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.question.key !== this.props.question.key) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <SentenceFragmentTemplate {...this.props} handleAttemptSubmission={() => {}} />
    );
  }

}

export default PlaySentenceFragment;
