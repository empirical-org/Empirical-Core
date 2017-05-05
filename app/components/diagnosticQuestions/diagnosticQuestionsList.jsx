import React from 'react';
import LinkListItem from '../shared/linkListItem.jsx'

export default React.createClass({
  renderListItems: function () {
    if (this.props.diagnosticQuestions.length === 0) {
      return;
    }
    return this.props.diagnosticQuestions.map((diagnosticQuestion) => {
      return (
        <LinkListItem
          key={diagnosticQuestion.key}
          itemKey={diagnosticQuestion.key}
          text={diagnosticQuestion.prompt}
          basePath="diagnostic-questions"
        />
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
