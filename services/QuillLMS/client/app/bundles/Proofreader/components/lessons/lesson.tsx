import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as lessonActions from '../../actions/proofreaderActivities';
import { Modal } from 'quill-component-library/dist/componentLibrary';
import ProofreaderActivityContainer from '../proofreaderActivities/container'
import EditLessonForm from './lessonForm';
import { ActionTypes } from '../../actions/actionTypes'
import { Question, Questions } from '../../interfaces/questions'
import { ProofreaderActivityState } from '../../reducers/proofreaderActivitiesReducer'
import { ConceptReducerState } from '../../reducers/conceptsReducer'
import { ProofreaderActivity } from '../../interfaces/proofreaderActivities'
import { Match } from '../../interfaces/match'
import { hashToCollection, } from '../../../Shared/index'

String.prototype.toKebab = function() {
  return this.replace(/([A-Z])/g, char => `-${char.toLowerCase()}`);
};

interface LessonProps {
  dispatch: Function;
  match: Match;
  lessons: ProofreaderActivityState;
  questions: Questions;
  concepts: ConceptReducerState;
}

class Lesson extends React.Component<LessonProps> {
  constructor(props: LessonProps) {
    super(props)

    this.questionsForLesson = this.questionsForLesson.bind(this)
    this.deleteLesson = this.deleteLesson.bind(this)
    this.cancelEditingLesson = this.cancelEditingLesson.bind(this)
    this.saveLessonEdits = this.saveLessonEdits.bind(this)
    this.editLesson = this.editLesson.bind(this)
    this.renderEditLessonForm = this.renderEditLessonForm.bind(this)
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  questionsForLesson(): Question[]|void {
    const { data, } = this.props.lessons
    const { lessonID, } = this.props.match.params
    const questions = this.props.questions ? hashToCollection(this.props.questions.data) : []
    const lessonConcepts = data[lessonID].concepts
    if (lessonConcepts) {
      const conceptUids = Object.keys(data[lessonID].concepts)
      return questions.filter(q => conceptUids.includes(q.concept_uid))
    }
  }

  lesson(): ProofreaderActivity|void {
    const { data, } = this.props.lessons
    const lessonID: string|undefined = this.props.match.params.lessonID;
    if (lessonID) {
      return data[lessonID]
    }
  }

  // renderQuestionsForLesson():Array<JSX.Element>|JSX.Element {
  //   const questionsForLesson = this.questionsForLesson();
  //   if (questionsForLesson) {
  //     const conceptIds: {[key:string]: Array<JSX.Element>} = {}
  //     questionsForLesson.forEach((question: Question) => {
  //       const { prompt, key, concept_uid} = question
  //       const displayName = prompt || 'No question prompt';
  //       const questionLink = <li key={key}><Link to={`/admin/questions/${question.key}`}>{displayName.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '')}</Link></li>
  //       if (conceptIds[concept_uid]) {
  //         conceptIds[concept_uid].push(questionLink)
  //       } else {
  //         conceptIds[concept_uid] = [questionLink]
  //       }
  //     });
  //     const conceptSections:Array<JSX.Element> = []
  //     const lesson = this.lesson()
  //     Object.keys(conceptIds).forEach(conceptId => {
  //       const lessonConcept = lesson ? lesson.concepts[conceptId] : null
  //       const quantity = lessonConcept ? lessonConcept.quantity : null
  //       const concept = this.props.concepts.data[0] ? this.props.concepts.data[0].find(c => c.uid === conceptId) : null
  //       const quantitySpan = <span style={{ fontStyle: 'italic' }}>{quantity} {quantity === 1 ? 'Question' : 'Questions'} Chosen at Random</span>
  //       conceptSections.push(<br/>)
  //       conceptSections.push(<h3>{concept ? concept.displayName : null} - {quantitySpan}</h3>)
  //       conceptSections.push(<ul>{conceptIds[conceptId]}</ul>)
  //     })
  //     return conceptSections
  //   }
  //   return (
  //     <ul>No questions</ul>
  //   );
  // }

  deleteLesson(): void {
    const lessonID: string|undefined = this.props.match.params.lessonID;
    if (lessonID && confirm('do you want to do this?')) {
      this.props.dispatch(lessonActions.deleteLesson(lessonID));
    }
  }

  cancelEditingLesson(): void {
    const { lessonID } = this.props.match.params
    if (lessonID) {
      this.props.dispatch(lessonActions.cancelLessonEdit(lessonID));
    }
  }

  saveLessonEdits(vals: ProofreaderActivity): void {
    const lessonID: string|undefined = this.props.match.params.lessonID;
    if (lessonID) {
      this.props.dispatch(lessonActions.submitLessonEdit(lessonID, vals));
    }
  }

  editLesson(): void {
    const { lessonID, } = this.props.match.params;
    if (lessonID) {
      this.props.dispatch(lessonActions.startLessonEdit(lessonID));
    }
  }

  renderEditLessonForm(): JSX.Element|void {
    const { data, states } = this.props.lessons
    const lessonID: string|undefined = this.props.match.params.lessonID;
    if (lessonID) {
      const lesson = data ? data[lessonID] : null
      if (lesson && states && states[lessonID] === ActionTypes.EDITING_LESSON) {
        return (
          <Modal close={this.cancelEditingLesson}>
            <EditLessonForm
              currentValues={lesson}
              lesson={lesson}
              submit={this.saveLessonEdits}
            />
          </Modal>
        );
      }
    }
  }

  renderActivity() {
    const lessonID: string|undefined = this.props.match.params.lessonID;
    return (<div style={{marginTop: '50px', border: '1px solid black', paddingBottom: '50px'}}>
      <ProofreaderActivityContainer activityUID={lessonID} admin={true} />
    </div>)
  }

  render() {
    const { data, } = this.props.lessons
    const lessonID: string|undefined = this.props.match.params.lessonID;
    if (data && lessonID && data[lessonID]) {
      return (
        <div>
          <Link to={'/admin/lessons'}>Return to All Activities</Link>
          <br />
          {this.renderEditLessonForm()}
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h4 className="title">{data[lessonID].title}</h4>
            <h6 className="subtitle" style={{ color: 'rgb(0, 194, 162)', paddingRight: '20px' }}>Flag: {data[lessonID].flag}</h6>
          </div>
          <h6 className="subtitle"><Link to={`/play/pf?anonymous=true&uid=${lessonID}`}>Play Proofreader Activity</Link></h6>
          <p className="control">
            <button className="button is-info" onClick={this.editLesson}>Edit Activity</button> <button className="button is-danger" onClick={this.deleteLesson}>Delete Activity</button>
          </p>
          <p style={{marginTop: '50px'}}>Note: the activity below functions exactly like the real activity, except that you won't be directed to a results page or to a Grammar activity upon finishing the review. Instead, the activity will reset.</p>
          {this.renderActivity()}
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

function select(state: any) {
  return {
    lessons: state.proofreaderActivities,
    questions: state.questions,
    routing: state.routing,
    concepts: state.concepts
  };
}

export default connect(select)(Lesson);
