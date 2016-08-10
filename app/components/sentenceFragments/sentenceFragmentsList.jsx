import React from 'react';

export default React.createClass({
  renderSentenceFragmentListItems: function () {
    if (this.props.sentenceFragments.length === 0) {
      return;
    }
    return this.props.sentenceFragments.map((sentenceFragment) => {
      return (
        <li>{sentenceFragment.prompt}</li>
      )
    })
  },

  render: function () {
    return (
      <ul>
        {this.renderSentenceFragmentListItems()}
      </ul>
    )
  }
})
