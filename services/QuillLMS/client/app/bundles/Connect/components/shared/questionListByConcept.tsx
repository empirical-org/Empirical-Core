import _ from 'lodash'
import * as React from 'react'

import { hashToCollection, } from '../../../Shared/index'

export class QuestionListByConcept extends React.Component<any, any> {

  renderLabel = (concept) => {
    return (
      <p className="menu-label">
        {concept.name}
      </p>
    );
  }

  renderQuestionLinks = (questions) => {
    let filtered;
    if (!this.props.showOnlyArchived) {
      filtered = questions.filter((question) => question.flag !== "archived" )
    } else {
      filtered = questions.filter((question) => question.flag === "archived" )
    }
    return filtered.map((question) => {
      if (question.prompt) {
        return (
          <a href={'connect#/admin/' + this.props.basePath + '/' + question.key + '/responses'} key={question.key}>
            <span dangerouslySetInnerHTML={{ __html: question.prompt }} />
          </a>
        );
      }
    });
  }

  renderConceptWithQuestions = (questions, label) => {
    if (questions.length === 0) {
      return;
    }

    const listItems = this.renderQuestionLinks(questions);
    return [
      label,
      (<ul className="menu-list">
        {listItems}
      </ul>)
    ];
  }

  mapConceptsToList = () => {
    const concepts = hashToCollection(this.props.concepts.data['0']);
    const questions = hashToCollection(this.props.questions);
    return concepts.map((concept) => {
      const label = this.renderLabel(concept);
      const questionsForConcept = questions.filter(q => q.conceptID === concept.uid)
      return this.renderConceptWithQuestions(questionsForConcept, label);
    })
  }

  renderQuestionsWithoutValidKey = () => {
    const concepts = hashToCollection(this.props.concepts.data['0']);
    const questions = hashToCollection(this.props.questions);
    const questionsToRender = _.reject(questions, (question) => {
      return !!_.find(concepts, {uid: question.conceptID})
    })
    const label = (<p className="menu-label">No valid concept</p>)
    return this.renderConceptWithQuestions(questionsToRender, label);
  }

  render() {
    return (
      <aside className="menu">
        <div className="admin-container">
          {this.renderQuestionsWithoutValidKey()}
          {this.mapConceptsToList()}
        </div>
      </aside>
    );
  }
}
