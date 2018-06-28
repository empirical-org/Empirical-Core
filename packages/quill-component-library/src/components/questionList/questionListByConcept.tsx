import React from 'react'
import _ from 'lodash'
import { hashToCollection } from '../../libs/hashToCollection'
import { LinkListItem } from './linkListItem'

class QuestionListByConcept extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.renderQuestionLinks = this.renderQuestionLinks.bind(this)
    this.mapConceptsToList = this.mapConceptsToList.bind(this)
    this.renderQuestionsWithoutValidKey = this.renderQuestionsWithoutValidKey.bind(this)
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

  renderQuestionsWithoutValidKey() {
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
  }

  render() {
    return (
      <aside className="menu">
        {this.mapConceptsToList()}
        {this.renderQuestionsWithoutValidKey()}
      </aside>
    );
  }
}

export { QuestionListByConcept }
