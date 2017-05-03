import React from 'react';
import { Link } from 'react-router';
export default React.createClass({
  renderFillInBlankListItems() {
    if (this.props.fillInTheBlanks.length !== 0) {
      return this.props.fillInTheBlanks.map(fillInBlank => (
        <li key={fillInBlank.key}><Link to={`admin/fill-in-the-blanks/${fillInBlank.key}`}>{fillInBlank.prompt}</Link></li>
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
