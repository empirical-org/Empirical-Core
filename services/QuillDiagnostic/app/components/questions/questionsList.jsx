import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/questions'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'
import {hashToCollection} from '../../libs/hashToCollection'
import QuestionListItem from './questionListItem.jsx'

const QuestionsList = React.createClass({
  renderLabel: function (concept) {
    return (
      <p className="menu-label">
        {concept.name}
      </p>
    );
  },

	renderResponseCount: function (question) {
		if (this.props.baseRoute !== "play" && question.responses) {
			return <span className="is-pulled-right"><strong>{_.keys(question.responses).length}</strong></span>
		}
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
          <QuestionListItem
            key={question.key}
            questionKey={question.key}
            baseRoute={this.props.baseRoute}
            prompt={formattedPrompt}
            responseCount={this.renderResponseCount(question)}
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
