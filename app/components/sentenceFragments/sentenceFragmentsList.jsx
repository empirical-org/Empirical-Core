import React from 'react';
import PromptListItem from '../shared/promptListItem.jsx'
export default React.createClass({
  renderSentenceFragmentListItems: function () {
    if (this.props.sentenceFragments.length === 0) {
      return;
    }
    return this.props.sentenceFragments.map((sentenceFragment) => {
      return (
        <PromptListItem
          key={sentenceFragment.key}
          itemKey={sentenceFragment.key}
          prompt={sentenceFragment.prompt}
          questionType="sentence-fragments"
        />
      )
    })
  },

  render: function () {
    return (
      <ul className="menu-list">
        {this.renderSentenceFragmentListItems()}
      </ul>
    )
  }
})
