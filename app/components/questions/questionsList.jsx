import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/questions'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'
import {hashToCollection} from '../../libs/hashToCollection'

const QuestionsList = React.createClass({
  renderLabel: function (concept) {
    return (
      <p className="menu-label">
        {concept.name}
      </p>
    );
  },

	renderResponseCount: function (question) {
		console.log(question)
		if (this.props.baseRoute !== "play" && question.responses) {
			return <span className="is-pulled-right">Responses: <strong>{_.keys(question.responses).length}</strong></span>
		}
	},

  renderQuestionLinks: function (questions) {
    return questions.map((question) => {
      return (<li key={question.key}><Link to={'/' + this.props.baseRoute + '/questions/' + question.key} activeClassName="is-active">{question.prompt}  {this.renderResponseCount(question)}</Link></li>);
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
    const concepts = hashToCollection(this.props.concepts.data);
    const questions = hashToCollection(this.props.questions.data);
    return concepts.map((concept) => {
      var label = this.renderLabel(concept);
      var questionsForConcept = _.where(questions, {conceptID: concept.key})
      return this.renderConceptWithQuestions(questionsForConcept, label);
    })
  },

  render: function () {
    return (
      <aside className="menu">
        {this.mapConceptsToList()}
      </aside>
    );
  }
});

export default QuestionsList
