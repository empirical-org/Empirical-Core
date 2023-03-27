import React, { Component } from 'react';

import SentenceFragmentTemplate from '../sentenceFragments/sentenceFragmentTemplateComponentML';

class PlaySentenceFragment extends Component {
  constructor(props) {
    super();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.question !== this.props.question) {
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
