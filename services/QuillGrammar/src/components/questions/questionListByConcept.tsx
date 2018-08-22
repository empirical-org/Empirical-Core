import * as React from 'react'
import _ from 'lodash'
import LinkListItem from '../shared/linkListItem'
import {
  hashToCollection
} from 'quill-component-library/dist/componentLibrary';
import { Concept } from '../../interfaces/concepts'
import { ConceptReducerState } from '../../reducers/conceptsReducer'
import { QuestionsReducerState } from '../../reducers/questionsReducer'
import { Question } from '../../interfaces/questions'

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
    this.renderQuestionsWithoutValidKey = this.renderQuestionsWithoutValidKey.bind(this)
  }

  renderLabel(concept: Concept) {
    return (
      <p className="menu-label">
      {concept.displayName}
      </p>
    );
  }

  renderQuestionLinks(questions: Array<Question>):Array<JSX.Element|undefined> {
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
            key={question.key}
            itemKey={question.key}
            basePath={this.props.basePath}
            text={formattedPrompt}
            subpath={'responses'}
          />
        );
      }
    });
  }

  renderConceptWithQuestions(questions: Array<Question>, label: JSX.Element, index: number) {
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
      count++
      const label = this.renderLabel(concept);
      const questionsForConcept = questions.filter(q => q.concept_uid === concept.uid)
      return this.renderConceptWithQuestions(questionsForConcept, label, count);
    })
  }

  renderQuestionsWithoutValidKey() {
    if(!this.props.displayNoConceptQuestions) {
      return (<div></div>)
    } else {
      const concepts = hashToCollection(this.props.concepts.data['0']);
      const questions = hashToCollection(this.props.questions.data);
      const questionsToRender = _.reject(questions, (question) => {
        return !!_.find(concepts, {uid: question.concept_uid})
      })
      const label = (<p className="menu-label">
      No valid concept
      </p>)
      return this.renderConceptWithQuestions(questionsToRender, label, 0);
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
