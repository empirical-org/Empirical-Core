import * as React from 'react'
import { hashToCollection } from '../../../Shared/index'
import { Concept } from '../../interfaces/concepts'
import { Question } from '../../interfaces/questions'
import { ConceptReducerState } from '../../reducers/conceptsReducer'
import { QuestionsReducerState } from '../../reducers/questionsReducer'
import LinkListItem from '../shared/linkListItem'

interface QuestionListByConceptProps {
  concepts: ConceptReducerState;
  showOnlyArchived: boolean;
  basePath: string;
  displayNoConceptQuestions: boolean;
  questions: QuestionsReducerState;
}

export default class QuestionListByConcept extends React.Component<QuestionListByConceptProps> {
  constructor(props: QuestionListByConceptProps) {
    super(props)

    this.renderQuestionLinks = this.renderQuestionLinks.bind(this)
    this.mapConceptsToList = this.mapConceptsToList.bind(this)
  }

  renderLabel(concept: Concept) {
    return (
      <p className="menu-label">
        {concept.displayName}
      </p>
    );
  }

  renderQuestionLinks(questions: Question[]): Array<JSX.Element|undefined> {
    let filtered;
    if (!this.props.showOnlyArchived) {
      filtered = questions.filter((question) => question.flag !== "archived" )
    } else {
      filtered = questions.filter((question) => question.flag === "archived" )
    }
    return filtered.map((question: Question) => {
      if (question.prompt) {
        const formattedPrompt = question.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")
        return (
          <LinkListItem
            basePath={this.props.basePath}
            itemKey={question.key}
            key={question.key}
            subpath="responses"
            text={formattedPrompt}
          />
        );
      }
    });
  }

  renderConceptWithQuestions(questions: Question[], label: JSX.Element, index: number) {
    if (questions.length === 0) {
      return;
    }

    const listItems = this.renderQuestionLinks(questions);
    return [
      label,
      (<ul className="menu-list" key={index}>
        {listItems}
      </ul>)
    ];
  }

  mapConceptsToList() {
    const concepts = hashToCollection(this.props.concepts.data[0]);
    const questions = hashToCollection(this.props.questions);
    let count = 0
    return concepts.sort((a: Concept, b: Concept) => a.displayName.localeCompare(b.displayName)).map((concept: Concept) => {
      count+=1
      const label = this.renderLabel(concept);
      const questionsForConcept = questions.filter(q => q.concept_uid === concept.uid)
      return this.renderConceptWithQuestions(questionsForConcept, label, count);
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
