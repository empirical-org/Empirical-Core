import React from 'react';
import LinkListItem from '../shared/linkListItem.jsx'
export default React.createClass({
  renderSentenceFragmentListItems: function () {
    const questions = this.props.sentenceFragments;
    if (questions.length === 0) {
      return;
    }
    let filtered;
    if (!this.props.showOnlyArchived) {
      filtered = questions.filter((question) =>
        question.flag !== "archived"
      )
    } else {
      filtered = questions.filter((question) =>
        question.flag === "archived"
      )
    }
    return filtered.map((sentenceFragment) => {
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
