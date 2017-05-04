import React from 'react';
import FillInBlankListItem from './fillInBlankListItem.jsx'
import { Link } from 'react-router';
export default React.createClass({
  renderFillInBlankListItems() {
    if (this.props.fillInTheBlanks.length !== 0) {
      return this.props.fillInTheBlanks.map(fillInBlank => (
        <FillInBlankListItem
          key={fillInBlank.key}
          identifier={fillInBlank.key}
          prompt={fillInBlank.prompt}
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
