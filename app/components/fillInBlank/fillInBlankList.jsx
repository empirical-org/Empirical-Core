import React from 'react';
import LinkListItem from '../shared/linkListItem.jsx'
export default React.createClass({
  renderFillInBlankListItems() {
    const questions = this.props.fillInTheBlanks;
    if (questions.length !== 0) {
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
      return filtered.map(fillInBlank => (
        <LinkListItem
          key={fillInBlank.key}
          itemKey={fillInBlank.key}
          text={fillInBlank.prompt}
          basePath="fill-in-the-blanks"
        />
      ));
    }
  },

  render() {
    return (
      <ul className="menu-list">
        {this.renderFillInBlankListItems()}
      </ul>
    );
  },
});
