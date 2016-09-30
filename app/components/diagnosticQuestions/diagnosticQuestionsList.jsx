import React from 'react';
import { Link } from 'react-router'
export default React.createClass({
  renderListItems: function () {
    if (this.props.diagnosticQuestions.length === 0) {
      return;
    }
    return this.props.diagnosticQuestions.map((diagnosticQuestion) => {
      return (
        <li><Link to={'admin/diagnostic-questions/' + diagnosticQuestion.key}>{diagnosticQuestion.prompt}</Link></li>
      )
    })
  },

  render: function () {
    return (
      <ul className="menu-list">
        {this.renderListItems()}
      </ul>
    )
  }
})
