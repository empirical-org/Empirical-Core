import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as lessonActions from '../../actions/grammarActivities';
import { Modal, hashToCollection } from 'quill-component-library/dist/componentLibrary';
import EditLessonForm from './lessonForm';
import { ActionTypes } from '../../actions/actionTypes'
import { Question, Questions } from '../../interfaces/questions'
import { GrammarActivityState } from '../../reducers/grammarActivitiesReducer'
import { GrammarActivity } from '../../interfaces/grammarActivities'
import { Match } from '../../interfaces/match'

String.prototype.toKebab = function () {
  return this.replace(/([A-Z])/g, char => `-${char.toLowerCase()}`);
};

interface LessonProps {
  dispatch: Function;
  match: Match;
  lessons: GrammarActivityState;
  questions: Questions;
}

class Lesson extends React.Component<LessonProps> {
  constructor(props: LessonProps) {
    super(props)

    this.questionsForLesson = this.questionsForLesson.bind(this)
    this.renderQuestionsForLesson = this.renderQuestionsForLesson.bind(this)
    this.deleteLesson = this.deleteLesson.bind(this)
    this.cancelEditingLesson = this.cancelEditingLesson.bind(this)
    this.saveLessonEdits = this.saveLessonEdits.bind(this)
    this.editLesson = this.editLesson.bind(this)
    this.renderEditLessonForm = this.renderEditLessonForm.bind(this)
  }

  questionsForLesson(): Array<Question>|void {
    const { data, } = this.props.lessons
    const { lessonID, }: string = this.props.match.params
    const questions = this.props.questions ? hashToCollection(this.props.questions.data) : []
    const lessonConcepts = data[lessonID].concepts
    if (lessonConcepts) {
      const conceptUids = Object.keys(data[lessonID].concepts)
      return questions.filter(q => conceptUids.includes(q.concept_uid))
    }
  }

  lesson(): GrammarActivity|void {
    const { data, } = this.props.lessons
    const lessonID: string|undefined = this.props.match.params.lessonID;
    if (lessonID) {
      return data[lessonID]
    }
  }

  renderQuestionsForLesson():Array<JSX.Element>|JSX.Element {
    const questionsForLesson = this.questionsForLesson();
    if (questionsForLesson) {
      const conceptIds: {[key:string]: Array<JSX.Element>} = {}
      questionsForLesson.forEach((question: Question) => {
        const { prompt, key, concept_uid} = question
        const displayName = prompt || 'No question prompt';
        const questionLink = <li key={key}><Link to={`/admin/questions/${question.key}`}>{displayName.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '')}</Link></li>
        if (conceptIds[concept_uid]) {
          conceptIds[concept_uid].push(questionLink)
        } else {
          conceptIds[concept_uid] = [questionLink]
        }
      });
      const conceptSections:Array<JSX.Element> = []
      Object.keys(conceptIds).forEach(conceptId => {
        const lessonConcept = this.lesson().concepts[conceptId]
        const quantity = lessonConcept.quantity
        const concept = this.props.concepts.data[0].find(c => c.uid === conceptId)
        const quantitySpan = <span style={{ fontStyle: 'italic' }}>{quantity} {quantity === 1 ? 'Question' : 'Questions'} Chosen at Random</span>
        conceptSections.push(<br/>)
        conceptSections.push(<h3>{concept.displayName} - {quantitySpan}</h3>)
        conceptSections.push(<ul>{conceptIds[conceptId]}</ul>)
      })
      return conceptSections
    }
    return (
      <ul>No questions</ul>
    );
  }

  deleteLesson():void {
    const lessonID: string|undefined = this.props.match.params.lessonID;
    if (confirm('do you want to do this?')) {
      this.props.dispatch(lessonActions.deleteLesson(lessonID));
    }
  }

  cancelEditingLesson():void {
    this.props.dispatch(lessonActions.cancelLessonEdit(this.props.match.params.lessonID));
  }

  saveLessonEdits(vals: GrammarActivity):void {
    const { data, } = this.props.lessons
    const lessonID: string|undefined = this.props.match.params.lessonID;
    this.props.dispatch(lessonActions.submitLessonEdit(lessonID, vals));
  }

  editLesson():void {
    const { lessonID, } = this.props.match.params;
    this.props.dispatch(lessonActions.startLessonEdit(lessonID));
    // // console.log("Edit button clicked");
  }

  renderEditLessonForm():JSX.Element|void {
    const { data, } = this.props.lessons
    const lessonID: string|undefined = this.props.match.params.lessonID;
    if (lessonID) {
      const lesson = data ? data[lessonID] : null
      if (this.props.lessons.states && this.props.lessons.states[lessonID] === ActionTypes.EDITING_LESSON) {
        return (
          <Modal close={this.cancelEditingLesson}>
            <EditLessonForm
              lesson={lesson}
              submit={this.saveLessonEdits}
              currentValues={lesson}
            />
          </Modal>
        );
      }
    }
  }

  render() {
    const { data, } = this.props.lessons
    const lessonID: string|undefined = this.props.match.params.lessonID;
    if (data && lessonID && data[lessonID]) {
      return (
        <div>
          <Link to={'admin/lessons'}>Return to All Lessons</Link>
          <br />
          {this.renderEditLessonForm()}
          <h4 className="title">{data[lessonID].title}</h4>

          <h6 className="subtitle">{data[lessonID].flag}</h6>
          <h6 className="subtitle"><Link to={`/play/sw?anonymous=true&uid=${lessonID}`}>Play Grammar Activity</Link></h6>
          <p className="control">
            <button className="button is-info" onClick={this.editLesson}>Edit Lesson</button> <button className="button is-danger" onClick={this.deleteLesson}>Delete Lesson</button>
          </p>
          {this.renderQuestionsForLesson()}
        </div>
      );
    } else if (this.props.lessons.hasreceiveddata === false) {
      return (<p>Loading...</p>);
    }
    return (
      <p>404: No Concept Found</p>
    );
  }

}

function select(state) {
  return {
    lessons: state.grammarActivities,
    questions: state.questions,
    routing: state.routing,
    concepts: state.concepts
  };
}

export default connect(select)(Lesson);
