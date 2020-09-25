import React, { Component } from 'react';

import SentenceFragmentTemplate from '../sentenceFragments/sentenceFragmentTemplateComponentML';

class PlaySentenceFragment extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SentenceFragmentTemplate
        {...this.props}
      />
    );
  }

}

export default PlaySentenceFragment;
