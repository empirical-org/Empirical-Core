import * as React from 'react'

import { hashToCollection } from '../../libs/hashToCollection'


class QuestionListByConcept extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.renderQuestionLinks = this.renderQuestionLinks.bind(this)
    this.mapConceptsToList = this.mapConceptsToList.bind(this)
  }

  renderLabel(concept) {
    return (
      <p className="menu-label">
        {concept.name}
      </p>
    );
  }

  renderQuestionLinks(questions) {
    let filtered;
    if (!this.props.showOnlyArchived) {
      filtered = questions.filter((question) => question.flag !== "archived" )
    } else {
      filtered = questions.filter((question) => question.flag === "archived" )
    }
    return filtered.map((question) => {
      if (question.prompt) {
        return (
          <a href={'/admin/' + this.props.basePath + '/' + question.key + '/responses'} key={question.key}>
            <div dangerouslySetInnerHTML={{ __html: question.prompt }} />
          </a>
        );
      }
    });
  }

  renderConceptWithQuestions(questions, label) {
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

  mapConceptsToList() {
    const concepts = hashToCollection(this.props.concepts.data['0']);
    const questions = hashToCollection(this.props.questions);
    return concepts.map((concept) => {
      const label = this.renderLabel(concept);
      const questionsForConcept = questions.filter(q => q.conceptID === concept.uid)
      return this.renderConceptWithQuestions(questionsForConcept, label);
    })
  }

  render() {
    return (
      <aside className="menu">
        {this.mapConceptsToList()}
      </aside>
    );
  }
}

export { QuestionListByConcept }
