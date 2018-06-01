import React from 'react';
import _ from 'underscore';

export default React.createClass({

  renderSentenceFragments() {
    return (
      <div className="draft-js sentence-fragments prevent-selection" dangerouslySetInnerHTML={{ __html: this.props.prompt, }} />
    );
  },

  render() {
    return this.renderSentenceFragments();
  },
});
