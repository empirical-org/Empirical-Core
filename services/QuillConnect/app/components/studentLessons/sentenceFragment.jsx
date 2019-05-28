import React, { Component } from 'react';
import { connect } from 'react-redux';

import SentenceFragmentTemplate from '../sentenceFragments/sentenceFragmentTemplateComponentML';

class PlaySentenceFragment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SentenceFragmentTemplate
        {...this.props}
        handleAttemptSubmission={() => {}}
      />
    );
  }

}

export default PlaySentenceFragment;
