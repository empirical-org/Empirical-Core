import React from 'react';
import LinkListItem from '../shared/linkListItem.jsx'

export default React.createClass({
  renderListItems: function () {
    const questions = this.props.diagnosticQuestions;
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
    return filtered.map((diagnosticQuestion) => {
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
