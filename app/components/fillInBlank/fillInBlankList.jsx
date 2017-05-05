import React from 'react';
import LinkListItem from '../shared/linkListItem.jsx'
export default React.createClass({
  renderFillInBlankListItems() {
    if (this.props.fillInTheBlanks.length !== 0) {
      return this.props.fillInTheBlanks.map(fillInBlank => (
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
