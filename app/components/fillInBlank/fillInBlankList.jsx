import React from 'react';
import PromptListItem from '../shared/promptListItem.jsx'
export default React.createClass({
  renderFillInBlankListItems() {
    if (this.props.fillInTheBlanks.length !== 0) {
      return this.props.fillInTheBlanks.map(fillInBlank => (
        <PromptListItem
          key={fillInBlank.key}
          itemKey={fillInBlank.key}
          prompt={fillInBlank.prompt}
          questionType="fill-in-the-blanks"
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
