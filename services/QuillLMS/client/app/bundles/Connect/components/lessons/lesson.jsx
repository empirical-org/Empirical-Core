import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FlagDropdown, Modal } from '../../../Shared/index';
import fillInBlankActions from '../../actions/fillInBlank';
import lessonActions from '../../actions/lessons';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import titleCardActions from '../../actions/titleCards';
import C from '../../constants.js';
import { permittedFlag } from '../../libs/flagArray';
import FillInBlankForm from '../fillInBlank/fillInBlankForm';
import QuestionForm from '../questions/questionForm';
import SentenceFragmentForm from '../sentenceFragments/sentenceFragmentForm';
import TitleCardForm from '../titleCards/titleCardForm';
import EditLessonForm from './lessonForm.jsx';

const icon = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/direction.svg`

//fake commit for linting
String.prototype.toKebab = function () {
  return this.replace(/([A-Z])/g, char => `-${char.toLowerCase()}`);
};

class Lesson extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      newQuestion: false
    }
  }

  handleDeleteLesson = () => {
    const { match } = this.props
    const { lessonID, } = match.params;
    if (confirm('do you want to do this?')) {
      dispatch(lessonActions.deleteLesson(lessonID));
    }
  };

  lesson = () => {
    const { lessons, match } = this.props
    const { data } = lessons
    const { lessonID, } = match.params;
    return data[lessonID]
  };

  getQuestionAction = () => {
    const questionType = this.lesson().questionType
    switch (questionType) {
      case C.INTERNAL_SENTENCE_COMBINING_TYPE:
        return questionActions.submitNewQuestion
      case C.INTERNAL_SENTENCE_FRAGMENTS_TYPE:
        return sentenceFragmentActions.submitNewSentenceFragment
      case C.INTERNAL_FILL_IN_BLANK_TYPE:
        return fillInBlankActions.submitNewQuestion
      case C.INTERNAL_TITLE_CARDS_TYPE:
        return titleCardActions.submitNewTitleCard
      default:
        return questionActions.submitNewQuestion
    }
  };

  promptForm = () => {
    const questionType = this.lesson().questionType
    switch (questionType) {
      case C.INTERNAL_SENTENCE_COMBINING_TYPE:
        return QuestionForm
      case C.INTERNAL_SENTENCE_FRAGMENTS_TYPE:
        return SentenceFragmentForm
      case C.INTERNAL_FILL_IN_BLANK_TYPE:
        return FillInBlankForm
      case C.INTERNAL_TITLE_CARDS_TYPE:
        return TitleCardForm
      default:
        return QuestionForm
    }
  };

  urlString = () => {
    const questionType = this.lesson().questionType
    switch (questionType) {
      case C.INTERNAL_SENTENCE_COMBINING_TYPE:
        return 'questions'
      case C.INTERNAL_SENTENCE_FRAGMENTS_TYPE:
        return 'sentence-fragments'
      case C.INTERNAL_FILL_IN_BLANK_TYPE:
        return 'fill-in-the-blanks'
      case C.INTERNAL_TITLE_CARDS_TYPE:
        return 'title-cards'
      default:
        return 'questions'
    }
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
    const { match, dispatch } = this.props
    const { params } = match
    const { lessonID, } = params;
    const qids = vals.questions ? vals.questions.map(q => q.key) : []
    dispatch(lessonActions.submitLessonEdit(lessonID, vals, qids));
  };

  renderEditLessonForm = () => {
    const { match, lessons } = this.props
    const { params } = match
    const { lessonID, } = params;
    const lesson = this.lesson();
    if (lessons.states[lessonID] === C.EDITING_LESSON) {
      return (
        <Modal close={this.cancelEditingLesson}>
          <EditLessonForm currentValues={lesson} lesson={lesson} submit={this.saveLessonEdits} />
        </Modal>
      );
    }
  };

  renderQuestionsForLesson = () => {
    const { match } = this.props
    const { params } = match
    const questionsForLesson = this.questionsForLesson();
    const lessonFlag = this.lesson().flag
    const lessonQuestionType = this.urlString()
    if (questionsForLesson) {
      const listItems = questionsForLesson.map((question, index) => {
        const questionNumber = `${index + 1}. `
        const { questionType, title, prompt, key, flag, cues } = question
        const displayName = (questionType === 'titleCards' ? title : prompt) || 'No question prompt';
        const questionTypeLink = questionType === 'fillInBlank' ? 'fill-in-the-blanks' : questionType.toKebab()
        const flagTag = permittedFlag(lessonFlag, flag) ? '' : <strong>{flag.toUpperCase()} - </strong>
        const className = (key === params.questionID || key === params.titleCardID) ? "selected" : ""
        const cuesList = (cues && cues[0] != "") ? cues.map((cue, index) => {
          return <span className="tag" key={index}>{cue}</span>
        }) : null
        const questionURL = lessonQuestionType === 'title-cards' ? `/admin/lesson-view/${params.lessonID}/${lessonQuestionType}/${key}/` :
          `/admin/lesson-view/${params.lessonID}/${lessonQuestionType}/${key}/responses`
        const questionDisplayString = questionNumber.concat(displayName.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''))
        return (
          <li className={className} key={index} >
            <Link to={questionURL}>
              {flagTag}
              {questionDisplayString}
              {cuesList}
            </Link>
          </li>
        );
      });
      return (
        <ul>{listItems}</ul>
      );
    }
    return (
      <ul>No questions</ul>
    );
  };

  onSelect = (e) => {
    const { dispatch } = this.props
    dispatch(lessonActions.setFlag(e.target.value))
  };

  handleCreatePrompt = () => {
    this.setState({ newQuestion: true, });
  };

  cancelEditingLesson = () => {
    const { match, dispatch } = this.props
    const { params } = match
    const { lessonID, } = params;
    dispatch(lessonActions.cancelLessonEdit(lessonID));
  };

  handleEditLesson = () => {
    const { match, dispatch } = this.props
    const { params } = match
    const { lessonID, } = params;
    dispatch(lessonActions.startLessonEdit(lessonID));
  };

  submitNewQuestion = (questionObj, optimalResponseObj) => {
    const { dispatch, match } = this.props
    const action = this.getQuestionAction()
    dispatch(action(questionObj, optimalResponseObj, match.params.lessonID))
    this.setState({ newQuestion: false, });
  };

  cancelEditingQuestion = () => {
    this.setState({ newQuestion: false})
  };

  renderNewQuestionForm = () => {
    const lesson = this.lesson()
    const { newQuestion } = this.state
    const question = {flag: lesson.flag, conceptID: lesson.modelConceptUID}
    const match = { params: { titleCardID: null }}
    const PromptForm = this.promptForm()
    if (!newQuestion) return
    return (
      <Modal close={this.cancelEditingQuestion}>
        <PromptForm
          action={this.submitNewQuestion}
          conceptID={lesson.modelConceptUID}
          data={question}
          flag={lesson.flag}
          match={match}
          new={true}
          question={question}
          routeParams={null}
          submit={this.submitNewQuestion}
        />
      </Modal>
    )
  };

  render() {
    const { isSidebar, lessons, match } = this.props;
    const { params } = match
    const { lessonID } = params
    if (this.lesson()) {
      const numberOfQuestions = this.lesson().questions ? this.lesson().questions.length : 0;
      if (isSidebar) {
        return (
          <div className="edit-activity">
            <Link to={`/admin/lessons/${lessonID}`}>Back</Link>
            <br /><br />
            {this.renderEditLessonForm()}
            <h4 className="title">{this.lesson().name}</h4>
            <h6 className="subtitle">{this.lesson().flag}</h6>
            <p className="control">
              <button className="button" onClick={this.handleEditLesson} type="button">Edit Activity</button>
            </p>
            <h6 className="subtitle">{numberOfQuestions} Questions</h6>
            {this.renderQuestionsForLesson()}
          </div>
        );
      }
      return (
        <div className="edit-activity">
          {this.renderNewQuestionForm()}
          <div style={{display: 'inline-block'}}>
            <FlagDropdown flag={lessons.flag} handleFlagChange={this.onSelect} isLessons={true} />
          </div>
          <br />
          <Link to='/admin/lessons'>Return to {lessons.flag} Activities</Link>
          <br /><br />
          {this.renderEditLessonForm()}
          <h4 className="title">{this.lesson().name}</h4>
          <h6 className="subtitle">{this.lesson().flag}</h6>
          <p className="control">
            <button className="button" onClick={this.handleEditLesson} type="button">Edit Activity</button>
            <button className="button" onClick={this.handleDeleteLesson} type="button">Delete Activity</button>
            <button className="button" onClick={this.handleCreatePrompt} type="button">Create Prompt</button>
            <Link className="button" rel="noopener noreferrer" target="_blank" to={`/play/lesson/${lessonID}`}>Play Activity</Link>
          </p>
          <h6 className="subtitle">{numberOfQuestions} Questions</h6>
          {this.renderQuestionsForLesson()}
        </div>
      );
    } else if (lessons.hasreceiveddata === false) {
      return (<p>Loading...</p>);
    }
    return (
      <p>404: No Concept Found</p>
    );
  }
};

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
