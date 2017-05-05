import React from 'react';
import PromptListItem from '../shared/promptListItem.jsx'

export default React.createClass({
  renderListItems: function () {
    if (this.props.diagnosticQuestions.length === 0) {
      return;
    }
    return this.props.diagnosticQuestions.map((diagnosticQuestion) => {
      return (
        <PromptListItem
          key={diagnosticQuestion.key}
          itemKey={diagnosticQuestion.key}
          prompt={diagnosticQuestion.prompt}
          questionType="diagnostic-questions"
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
