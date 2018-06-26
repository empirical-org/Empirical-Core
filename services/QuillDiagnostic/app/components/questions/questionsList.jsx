import React from 'react'
import _ from 'underscore'
import { hashToCollection } from '../../libs/hashToCollection'
import { LinkListItem } from 'quill-component-library/dist/componentLibrary'

const QuestionsList = React.createClass({
  renderLabel: function (concept) {
    return (
      <p className="menu-label">
        {concept.name}
      </p>
    );
  },

  renderQuestionLinks: function (questions) {
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
    return filtered.map((question) => {
      if (question.prompt) {
        const formattedPrompt = question.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")
        return (
          <LinkListItem
            key={question.key}
            itemKey={question.key}
            basePath={this.props.basePath}
            text={formattedPrompt}
          />
        );
      }
    });
  },

  renderConceptWithQuestions: function (questions, label) {
    if (questions.length === 0) {
      return;
    }

    var listItems = this.renderQuestionLinks(questions);
    return [
      label,
      (<ul className="menu-list">
        {listItems}
      </ul>)
    ];
  },

  mapConceptsToList: function () {
    const concepts = hashToCollection(this.props.concepts.data['0']);
    const questions = hashToCollection(this.props.questions.data);
    return concepts.map((concept) => {
      var label = this.renderLabel(concept);
      var questionsForConcept = _.where(questions, {conceptID: concept.uid})
      return this.renderConceptWithQuestions(questionsForConcept, label);
    })
  },

  renderQuestionsWithoutValidKey: function () {
    if(!this.props.displayNoConceptQuestions) {
      return (<div></div>)
    } else {
      const concepts = hashToCollection(this.props.concepts.data['0']);
      const questions = hashToCollection(this.props.questions.data);
      const questionsToRender = _.reject(questions, (question) => {
        return !!_.find(concepts, {uid: question.conceptID})
      })
      const label = (<p className="menu-label">
        No valid concept
      </p>)
      return this.renderConceptWithQuestions(questionsToRender, label);
    }
  },

  render: function () {
    return (
      <aside className="menu">
        {this.mapConceptsToList()}
        {this.renderQuestionsWithoutValidKey()}
      </aside>
    );
  }
});

export default QuestionsList
