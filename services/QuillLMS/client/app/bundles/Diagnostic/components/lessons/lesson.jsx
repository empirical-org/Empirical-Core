import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'underscore';
import lessonActions from '../../actions/lessons.ts';
import C from '../../constants.js';
import EditLessonForm from './lessonForm.tsx';
import { Modal } from '../../../Shared/index'

String.prototype.toKebab = function () {
  return this.replace(/([A-Z])/g, char => `-${char.toLowerCase()}`);
};

class Lesson extends React.Component {
  questionsForLesson = () => {
    const {  lessons, match } = this.props;
    const { data } = lessons;
    const { params } = match;
    const { lessonID } = params;
    if (data[lessonID].questions) {
      return _.values(data[lessonID].questions).map((question) => {
        const questions = this.props[question.questionType].data;
        const qFromDB = Object.assign({}, questions[question.key]);
        qFromDB.questionType = question.questionType;
        qFromDB.key = question.key;
        return qFromDB;
      });
    }
  };

  renderQuestionsForLesson = () => {
    const questionsForLesson = this.questionsForLesson();
    if (questionsForLesson) {
      const listItems = questionsForLesson.map((question) => {
        const { questionType, title, prompt, key, } = question
        const displayName = (questionType === 'titleCards' ? title : prompt) || 'No question prompt';
        const questionTypeLink = questionType === 'fillInBlank' ? 'fill-in-the-blanks' : questionType.toKebab()
        return <li key={question.key}><Link to={`/admin/${questionTypeLink || 'questions'}/${question.key}`}>{displayName.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '')}</Link></li>;
      });
      return (
        <ul>{listItems}</ul>
      );
    }
    return (
      <ul>No questions</ul>
    );
  };

  deleteLesson = () => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { lessonID } = params;
    if (confirm('do you want to do this?')) {
      // TODO: fix delete lesson action
      dispatch(lessonActions.deleteLesson(lessonID));
    }
  };

  cancelEditingLesson = () => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { lessonID } = params;
    dispatch(lessonActions.cancelLessonEdit(lessonID));
  };

  saveLessonEdits = (vals) => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { lessonID } = params;
    const qids = vals.questions ? vals.questions.map(q => q.key) : []
    dispatch(lessonActions.submitLessonEdit(lessonID, vals, qids));
  };

  editLesson = () => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { lessonID } = params;
    dispatch(lessonActions.startLessonEdit(lessonID));
  };

  renderEditLessonForm = () => {
    const { lessons, match} = this.props;
    const { params } = match;
    const { lessonID } = params;
    const { data, states } = lessons;
    const lesson = (data[lessonID]);
    if (states[lessonID] === C.EDITING_LESSON) {
      return (
        <Modal close={this.cancelEditingLesson}>
          <EditLessonForm currentValues={lesson} lesson={lesson} submit={this.saveLessonEdits} />
        </Modal>
      );
    }
  };

  render() {
    const { lessons, match } = this.props;
    const { params } = match;
    const { lessonID } = params;
    const { data, hasreceiveddata } = lessons;
    if (data[lessonID]) {
      const numberOfQuestions = data[lessonID].questions ? data[lessonID].questions.length : 0;
      return (
        <div>
          <Link to="/admin/lessons">Return to All Activities</Link>
          <br />
          {this.renderEditLessonForm()}
          <h4 className="title">{data[lessonID].name}</h4>

          <h6 className="subtitle">{data[lessonID].flag}</h6>
          <h6 className="subtitle">{numberOfQuestions} Questions</h6>
          <h6 className="subtitle"><Link to={`/play/diagnostic/${lessonID}`}>Play Diagnostic</Link></h6>
          <p className="control">
            <button className="button is-info" onClick={this.editLesson}>Edit Activity</button> <button className="button is-danger" onClick={this.deleteLesson}>Delete Activity</button>
          </p>
          {this.renderQuestionsForLesson()}
        </div>
      );
    } else if (hasreceiveddata === false) {
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
