import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'underscore';
import lessonActions from '../../actions/lessons';
import { permittedFlag } from '../../libs/flagArray'
import { Modal } from 'quill-component-library/dist/componentLibrary';
import C from '../../constants.js';
import EditLessonForm from './lessonForm.jsx';

String.prototype.toKebab = function () {
  return this.replace(/([A-Z])/g, char => `-${char.toLowerCase()}`);
};

class Lesson extends React.Component {
  cancelEditingLesson = () => {
    const { dispatch, match } = this.props
    const { params } = match
    const { lessonID } = params
    dispatch(lessonActions.cancelLessonEdit(lessonID));
  };

  deleteLesson = () => {
    const { dispatch, match } = this.props
    const { params } = match
    const { lessonID } = params
    if (confirm('do you want to do this?')) {
      dispatch(lessonActions.deleteLesson(lessonID));
    }
  };

  editLesson = () => {
    const { dispatch, match } = this.props
    const { params } = match
    const { lessonID } = params
    dispatch(lessonActions.startLessonEdit(lessonID));
  };

  lesson = () => {
    const { lessons, match } = this.props
    const { params } = match
    const { lessonID } = params
    const { data } = lessons
    return data[lessonID]
  };

  questionsForLesson = () => {
    if (this.lesson().questions) {
      return this.lesson().questions.map((question) => {
        const questions = this.props[question.questionType].data;
        const qFromDB = Object.assign({}, questions[question.key]);
        qFromDB.questionType = question.questionType;
        qFromDB.key = question.key;
        return qFromDB;
      });
    }
  };

  saveLessonEdits = (vals) => {
    const { dispatch, match } = this.props
    const { params } = match
    const { lessonID } = params
    const qids = vals.questions ? vals.questions.map(q => q.key) : []
    dispatch(lessonActions.submitLessonEdit(lessonID, vals, qids));
  };

  renderEditLessonForm = () => {
    const { lessons, match } = this.props
    const { states } = lessons
    const { params } = match
    const { lessonID } = params
    const lesson = this.lesson();
    if (states[lessonID] === C.EDITING_LESSON) {
      return (
        <Modal close={this.cancelEditingLesson}>
          <EditLessonForm currentValues={lesson} lesson={lesson} submit={this.saveLessonEdits} />
        </Modal>
      );
    }
  };

  renderQuestionsForLesson = () => {
    const questionsForLesson = this.questionsForLesson();
    const lessonFlag = this.lesson().flag
    if (questionsForLesson) {
      const listItems = questionsForLesson.map((question) => {
        const { questionType, title, prompt, key, flag } = question
        const displayName = (questionType === 'titleCards' ? title : prompt) || 'No question prompt';
        const questionTypeLink = questionType === 'fillInBlank' ? 'fill-in-the-blanks' : questionType.toKebab()
        const flagTag = permittedFlag(lessonFlag, flag) ? '' : <strong>{flag.toUpperCase()} - </strong>
        return (
          <li key={key}>
            <Link to={`/admin/${questionTypeLink || 'questions'}/${key}`}>
              {flagTag}
              {displayName.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '')}
            </Link>
          </li>);
      });
      return (
        <ul>{listItems}</ul>
      );
    }
    return (
      <ul>No questions</ul>
    );
  };

  render() {
    const { match } = this.props
    const { params } = match
    const { lessonID } = params
    const lesson = this.lesson()
    if (lesson) {
      const numberOfQuestions = lesson.questions ? lesson.questions.length : 0;
      return (
        <div>
          <Link to={'admin/lessons'}>Return to All Activities</Link>
          <br />
          {this.renderEditLessonForm()}
          <h4 className="title">{lesson.name}</h4>

          <h6 className="subtitle">{lesson.flag}</h6>
          <h6 className="subtitle">{numberOfQuestions} Questions</h6>
          <h6 className="subtitle"><Link to={`play/lesson/${lessonID}`}>{`quillconnect.firebaseapp.com/#/play/lesson/${lessonID}`}</Link></h6>
          <p className="control">
            <button className="button is-info" onClick={this.editLesson}>Edit Activity</button> <button className="button is-danger" onClick={this.deleteLesson}>Delete Activity</button>
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
    lessons: state.lessons,
    questions: state.questions,
    routing: state.routing,
    sentenceFragments: state.sentenceFragments,
    fillInBlank: state.fillInBlank,
    titleCards: state.titleCards
  };
}

export default connect(select)(Lesson);
