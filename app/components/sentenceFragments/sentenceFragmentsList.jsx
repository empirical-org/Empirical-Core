import React from 'react';
import LinkListItem from '../shared/linkListItem.jsx'
export default React.createClass({
  renderSentenceFragmentListItems: function () {
    if (this.props.sentenceFragments.length === 0) {
      return;
    }
    return this.props.sentenceFragments.filter((sentenceFragment) => 
      sentenceFragment.flag !== "Archive"
    ).map((sentenceFragment) => {
      return (
        <LinkListItem
          key={sentenceFragment.key}
          itemKey={sentenceFragment.key}
          text={sentenceFragment.prompt}
          basePath="sentence-fragments"
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
