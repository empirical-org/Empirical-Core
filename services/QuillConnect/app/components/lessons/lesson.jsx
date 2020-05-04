import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'underscore';
import lessonActions from '../../actions/lessons';
import { permittedFlag } from '../../libs/flagArray'
import { FlagDropdown, Modal } from 'quill-component-library/dist/componentLibrary';
import C from '../../constants.js';
import EditLessonForm from './lessonForm.jsx';
import QuestionForm from '../questions/questionForm'
import SentenceFragmentForm from '../sentenceFragments/sentenceFragmentForm'
import FillInBlankForm from '../fillInBlank/fillInBlankForm'
import TitleCardForm from '../titleCards/titleCardForm'
import questionActions from '../../actions/questions'
import sentenceFragmentActions from '../../actions/sentenceFragments'
import fillInBlankActions from '../../actions/fillInBlank'
import titleCardActions from '../../actions/titleCards'

const icon = `${process.env.QUILL_CDN_URL}/images/icons/direction.svg`

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

  deleteLesson = () => {
    const { lessonID, } = this.props.match.params;
    if (confirm('do you want to do this?')) {
      this.props.dispatch(lessonActions.deleteLesson(lessonID));
    }
  }

  editLesson = () => {
    const { lessonID, } = this.props.match.params;
    this.props.dispatch(lessonActions.startLessonEdit(lessonID));
  }

  lesson = () => {
    const { data, } = this.props.lessons
    const { lessonID, } = this.props.match.params;
    return data[lessonID]
  }

  getQuestionAction = () => {
    const questionType = this.lesson().questionType
    if (questionType == 'questions') {
      return questionActions.submitNewQuestion
    } else if (questionType == 'sentenceFragments') {
      return sentenceFragmentActions.submitNewSentenceFragment
    } else if (questionType == 'fillInBlank') {
      return fillInBlankActions.submitNewQuestion
    } else if (questionType == 'titleCards') {
      return titleCardActions.submitNewTitleCard
    }
    return questionActions.submitNewQuestion
  }

  promptForm = () => {
    const questionType = this.lesson().questionType
    if (questionType == 'questions') {
      return QuestionForm
    } else if (questionType == 'sentenceFragments') {
      return SentenceFragmentForm
    } else if (questionType == 'fillInBlank') {
      return FillInBlankForm
    } else if (questionType == 'titleCards') {
      return TitleCardForm
    }
    return QuestionForm
  }

  urlString = () => {
    const questionType = this.lesson().questionType
    console.log(questionType)
    if (questionType == 'questions') {
      return 'questions'
    } else if (questionType == 'sentenceFragments') {
      return 'sentence-fragments'
    } else if (questionType == 'fillInBlank') {
      return 'fill-in-the-blanks'
    } else if (questionType == 'titleCards') {
      return 'title-cards'
    }
    return 'questions'
  }

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
  }

  saveLessonEdits = (vals) => {
    const { lessonID, } = this.props.match.params;
    const qids = vals.questions ? vals.questions.map(q => q.key) : []
    console.log("saving")
    console.log(vals)
    this.props.dispatch(lessonActions.submitLessonEdit(lessonID, vals, qids));
  };

  renderEditLessonForm = () => {
    const { lessonID, } = this.props.match.params;
    const lesson = this.lesson();
    if (this.props.lessons.states[lessonID] === C.EDITING_LESSON) {
      return (
        <Modal close={this.cancelEditingLesson}>
          <EditLessonForm currentValues={lesson} lesson={lesson} submit={this.saveLessonEdits} />
        </Modal>
      );
    }
  }

  renderQuestionsForLesson = () => {
    const { params } = this.props.match
    const questionsForLesson = this.questionsForLesson();
    const lessonFlag = this.lesson().flag
    const lessonQuestionType = this.urlString()
    if (questionsForLesson) {
      const listItems = questionsForLesson.map((question, index) => {
        const questionNumber = (index + 1).toString().concat(". ")
        const { questionType, title, prompt, key, flag, cues } = question
        const displayName = (questionType === 'titleCards' ? title : prompt) || 'No question prompt';
        const questionTypeLink = questionType === 'fillInBlank' ? 'fill-in-the-blanks' : questionType.toKebab()
        const flagTag = permittedFlag(lessonFlag, flag) ? '' : <strong>{flag.toUpperCase()} - </strong>
        const className = (key === params.questionID) ? "selected" : ""
        const cuesList = (cues && cues[0] != "") ? cues.map((cue, index) => {
          return <span className="tag" key={index}>{cue}</span>
        }) : null
        const questionURL = lessonQuestionType === 'title-cards' ? `admin/lessons/${params.lessonID}/${lessonQuestionType}/${key}` :
                            `/admin/${lessonQuestionType}/${key}/responses`
        return (
          <li className={className} key={key} >
            <Link to={questionURL}>
              {flagTag}
              {questionNumber.concat(displayName.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, ''))}
              {cuesList}
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
  }

  onSelect = (e) => {
    const { dispatch } = this.props
    dispatch(lessonActions.setFlag(e.target.value))
  }

  deleteLesson = () => {
    const { lessonID, } = this.props.match.params;
    if (confirm('do you want to do this?')) {
      this.props.dispatch(lessonActions.deleteLesson(lessonID));
    }
  }

  handleCreatePrompt = () => {
    this.setState({ newQuestion: true, });
  }

  cancelEditingLesson = () => {
    const { lessonID, } = this.props.match.params;
    this.props.dispatch(lessonActions.cancelLessonEdit(lessonID));
  }

  handleEditLesson = () => {
    const { lessonID, } = this.props.match.params;
    this.props.dispatch(lessonActions.startLessonEdit(lessonID));
    // // console.log("Edit button clicked");
  }

  renderEditLessonForm = () => {
    const { lessonID, } = this.props.match.params;
    const lesson = this.lesson();
    if (this.props.lessons.states[lessonID] === C.EDITING_LESSON) {
      return (
        <Modal close={this.cancelEditingLesson}>
          <EditLessonForm currentValues={lesson} lesson={lesson} submit={this.saveLessonEdits} />
        </Modal>
      );
    }
  }

  submitNewQuestion = (questionObj, optimalResponseObj) => {
    const { dispatch, match } = this.props
    const action = this.getQuestionAction()
    dispatch(action(questionObj, optimalResponseObj, match.params.lessonID))
    this.setState({ newQuestion: false, });
  }

  cancelEditingQuestion = () => {
    this.setState({ newQuestion: false})
  }

  renderNewQuestionForm = () => {
    const lesson = this.lesson()
    const { newQuestion } = this.state
    const PromptForm = this.promptForm()
    if (newQuestion) {
      return (
        <Modal close={this.cancelEditingQuestion}>
          <PromptForm action={this.submitNewQuestion} new={true} question={{flag: lesson.flag, conceptID: lesson.modelConceptUID}} routeParams={} submit={this.submitNewQuestion} />
        </Modal>
      )
    }
  }

  render() {
    const { isSidebar, lessons, match } = this.props;
    const { params } = match
    const { lessonID } = params
    if (this.lesson()) {
      const numberOfQuestions = this.lesson().questions ? this.lesson().questions.length : 0;
      if (isSidebar) {
        return (
          <div className="edit-activity">
            <Link to={`admin/lessons/${lessonID}`}>Back</Link>
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
            <button className="button" onClick={this.deleteLesson} type="button">Delete Activity</button>
            <button className="button" onClick={this.handleCreatePrompt} type="button">Create Prompt</button>
            <a className="button" href={`https://quillconnect.firebaseapp.com/#/play/lesson/${lessonID}`} rel="noopener noreferrer" target="_blank">Play Activity</a>
          </p>
          <h6 className="subtitle">{numberOfQuestions} Questions</h6>
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
