import React from 'react';
import { Link } from 'react-router'
export default React.createClass({
  renderSentenceFragmentListItems: function () {
    if (this.props.sentenceFragments.length === 0) {
      return;
    }
    return this.props.sentenceFragments.map((sentenceFragment) => {
      return (
        <li><Link to={'admin/sentence-fragments/' + sentenceFragment.key}>{sentenceFragment.questionText}</Link></li>
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
