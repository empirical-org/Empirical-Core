import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'underscore';

import PlayLessonQuestion from './question';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayFillInTheBlankQuestion from './fillInBlank.tsx'
import Finished from './finished.jsx';

import SessionActions from '../../actions/sessions.js';
import {
  PlayTitleCard,
  Spinner,
  ProgressBar,
  Register
} from '../../../Shared/index';
import { clearData, loadData, nextQuestion, submitResponse, updateCurrentQuestion, resumePreviousSession, setCurrentQuestion } from '../../actions.js';
import { getConceptResultsForAllQuestions, calculateScoreForLesson } from '../../libs/conceptResults/lesson';
import { getParameterByName } from '../../libs/getParameterByName';
import { permittedFlag } from '../../libs/flagArray'
import {
  questionCount,
  answeredQuestionCount,
  getProgressPercent
} from '../../libs/calculateProgress'

const request = require('request');

//TODO: convert to TSX and add interface definitions

export class Lesson extends React.Component {
  constructor(props) {
    super(props);

    const isLastQuestion = props.playLesson.unansweredQuestions.length === 0 && props.playLesson.answeredQuestions.length > 0;

    this.state = {
      hasOrIsGettingResponses: false,
      sessionInitialized: false,
      introSkipped: false,
      isLastQuestion: isLastQuestion,
      lessonLoaded: false
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(clearData());
  }

  //TODO: refactor into componentDidUpdate

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { playLesson, } = this.props
    const answeredQuestionsHasChanged = nextProps.playLesson.answeredQuestions.length !== playLesson.answeredQuestions.length
    const nextPropsAttemptsLength = nextProps.playLesson.currentQuestion && nextProps.playLesson.currentQuestion.question && nextProps.playLesson.currentQuestion.question.attempts ? nextProps.playLesson.currentQuestion.question.attempts.length : 0
    const thisPropsAttemptsLength = playLesson.currentQuestion && playLesson.currentQuestion.question &&  playLesson.currentQuestion.question.attempts ? playLesson.currentQuestion.question.attempts.length : 0
    const attemptsHasChanged = nextPropsAttemptsLength !== thisPropsAttemptsLength
    if (answeredQuestionsHasChanged || attemptsHasChanged) {
      this.saveSessionData(nextProps.playLesson);
    }
  }

  componentDidUpdate(prevProps) {
    const { sessionInitialized, isLastQuestion, lessonLoaded } = this.state
    const { dispatch, questions, fillInBlank, sentenceFragments, titleCards, previewMode, questionToPreview, playLesson, skippedToQuestionFromIntro, match, lessons } = this.props
    const { data, hasreceiveddata } = lessons
    const { params } = match
    const { lessonID, } = params;

    if (prevProps.lessons.hasreceiveddata != hasreceiveddata && hasreceiveddata) {
      document.title = `Quill.org | ${data[lessonID].name}`
    }
    // At mount time the component may still be waiting on questions
    // to be retrieved, so we need to do checks on component update
    if (questions.hasreceiveddata &&
        fillInBlank.hasreceiveddata &&
        sentenceFragments.hasreceiveddata &&
        titleCards.hasreceiveddata) {
      // This function will bail early if it has already set question data
      // so it is safe to call repeatedly
      SessionActions.populateQuestions("SC", questions.data);
      SessionActions.populateQuestions("FB", fillInBlank.data);
      SessionActions.populateQuestions("SF", sentenceFragments.data);
      SessionActions.populateQuestions("TL", titleCards.data);
      // This used to be an DidMount call, but we can't safely call it
      // until the Session module has received Question data, so now
      // we check if the value has been initalized, and if not we do so now
      if (!sessionInitialized) {
        this.saveSessionIdToState();
      }
      if(lessons.hasreceiveddata && data && !lessonLoaded) {
        const action = loadData(this.questionsForLesson());
        dispatch(action);
        this.setState({ lessonLoaded: true });
      }
      if(prevProps.skippedToQuestionFromIntro !== skippedToQuestionFromIntro && previewMode && questionToPreview) {
        this.setState({ introSkipped: true });
        this.startActivity();
      }
      // user has toggled to last question
      if(previewMode && questionToPreview && playLesson && playLesson.questionSet && !isLastQuestion && !this.getNextPreviewQuestion(questionToPreview)) {
        this.toggleIsLastQuestion();
      }
      // user has toggled to another question from last question
      if(previewMode && questionToPreview && playLesson && playLesson.questionSet && isLastQuestion && this.getNextPreviewQuestion(questionToPreview)) {
        this.toggleIsLastQuestion();
      }
    }
  }

  toggleIsLastQuestion = () => {
    this.setState(prevState => ({ isLastQuestion: !prevState.isLastQuestion }));
  }

  getNextPreviewQuestion = () => {
    const { playLesson } = this.props;
    const { unansweredQuestions } = playLesson;
    return unansweredQuestions[0];
  }

  getLesson = () => {
    const { lessons, match } = this.props
    const { data } = lessons
    const { params } = match
    const { lessonID } = params
    return data[lessonID];
  }

  getQuestion = () => {
    const { playLesson } = this.props;
    const { question } = playLesson.currentQuestion;
    return question;
  }

  createAnonActivitySession = (lessonID, results, score) => {
    request(
      { url: `${process.env.DEFAULT_URL}/api/v1/activity_sessions/`,
        method: 'POST',
        json:
        {
          state: 'finished',
          activity_uid: lessonID,
          concept_results: results,
          percentage: score,
        }
      },
      (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          // to do, use Sentry to capture error
          document.location.href = `${process.env.DEFAULT_URL}/activity_sessions/${body.activity_session.uid}`;
          this.setState({ saved: true, });
        }
      }
    );
  }

  finishActivitySession = (sessionID, results, score) => {
    request(
      { url: `${process.env.DEFAULT_URL}/api/v1/activity_sessions/${sessionID}`,
        method: 'PUT',
        json:
        {
          state: 'finished',
          concept_results: results,
          percentage: score,
        }
      },
      (err, httpResponse, body) => {
        if (httpResponse && httpResponse.statusCode === 200) {
          // to do, use Sentry to capture error
          SessionActions.delete(sessionID);
          document.location.href = `${process.env.DEFAULT_URL}/activity_sessions/${sessionID}`;
          this.setState({ saved: true, });
        } else {
          this.setState({
            saved: false,
            error: body.meta.message,
          });
        }
      }
    );
  }

  hasQuestionsInQuestionSet = (props) => {
    const pL = props.playLesson;
    return (pL && pL.questionSet && pL.questionSet.length);
  }

  markIdentify = (bool) => {
    const { dispatch, } = this.props
    const action = updateCurrentQuestion({ identified: bool, });
    dispatch(action);
  }

  nextQuestion = () => {
    const { dispatch, previewMode, onHandleToggleQuestion } = this.props;
    if(previewMode) {
      const questionObject = this.getNextPreviewQuestion();
      if(questionObject && questionObject.question) {
        const { question } = questionObject
        onHandleToggleQuestion(question)
        const action = setCurrentQuestion(question);
        dispatch(action);
      } else {
        this.toggleIsLastQuestion();
      }
    } else {
      const next = nextQuestion();
      return dispatch(next);
    }
  }

  questionsForLesson = () => {
    const { match, lessons } = this.props
    const { data, } = lessons
    const { params, } = match
    const { lessonID, } = params;
    const filteredQuestions = data[lessonID].questions.filter((ques) => {
      const question = this.props[ques.questionType].data[ques.key] // eslint-disable-line react/destructuring-assignment
      return question && permittedFlag(data[lessonID].flag, question.flag)
    });
    // this is a quickfix for missing questions -- if we leave this in here
    // long term, we should return an array through a forloop to
    // cut the time from 2N to N
    return filteredQuestions.map((questionItem) => {
      const questionType = questionItem.questionType;
      const key = questionItem.key;
      const question = this.props[questionType].data[key];  // eslint-disable-line react/destructuring-assignment
      question.key = key;
      let type
      switch (questionType) {
        case 'questions':
          type = 'SC'
          break
        case 'fillInBlank':
          type = 'FB'
          break
        case 'titleCards':
          type = 'TL'
          break
        case 'sentenceFragments':
        default:
          type = 'SF'
      }
      return { type, question, };
    });
  }

  resumeSession = (data) => {
    const { dispatch, } = this.props
    if (data) {
      dispatch(resumePreviousSession(data));
    }
  }

  saveSessionData = (lessonData) => {
    const { sessionID, } = this.state
    if (sessionID) {
      SessionActions.update(sessionID, lessonData);
    }
  }

  saveSessionIdToState = () => {
    let sessionID = getParameterByName('student');
    const badSessionIds = ['null', 'nullhttps://connect.quill.org/', 'nullhttps:/connect.quill.org/']
    if (badSessionIds.includes(sessionID)) {
      sessionID = undefined;
    }
    this.setState({ sessionID, sessionInitialized: true}, () => {
      if (sessionID) {
        SessionActions.get(sessionID, (data) => {
          this.setState({ session: data, });
        });
      }
    });
  }

  saveToLMS = () => {
    const { playLesson, match, previewMode } = this.props
    const { params } = match
    const { sessionID, } = this.state
    const { lessonID, } = params;
    this.setState({ error: false, });
    const relevantAnsweredQuestions = playLesson.answeredQuestions.filter(q => q.questionType !== 'TL')
    const results = getConceptResultsForAllQuestions(relevantAnsweredQuestions);
    const score = calculateScoreForLesson(relevantAnsweredQuestions);
    if (sessionID && !previewMode) {
      this.finishActivitySession(sessionID, results, score);
    } else {
      this.createAnonActivitySession(lessonID, results, score);
    }
  }

  startActivity = () => {
    const { dispatch, skippedToQuestionFromIntro, questionToPreview, previewMode } = this.props
    const action = loadData(this.questionsForLesson());
    dispatch(action);
    // when user skips to question from the landing page, we set the current question here in this one instance
    if(previewMode && skippedToQuestionFromIntro && questionToPreview) {
      const action = setCurrentQuestion(questionToPreview);
      dispatch(action);
    } else {
      const next = nextQuestion();
      dispatch(next);
    }
  }

  submitResponse = (response) => {
    const { dispatch, } = this.props
    const action = submitResponse(response);
    dispatch(action);
  }

  getPreviewQuestionCount = () => {
    const { playLesson, questionToPreview } = this.props;
    const { questionSet } = playLesson;
    if(!questionToPreview) {
      return 1;
    }
    const { key } = questionToPreview;
    const questionKeys = questionSet.map(questionObject => questionObject.question.key);
    return questionKeys.indexOf(key) + 1;
  }

  renderProgressBar = () => {
    const { playLesson, previewMode, questionToPreview } = this.props
    if (!playLesson.currentQuestion) { return }

    const calculatedAnsweredQuestionCount = answeredQuestionCount(playLesson)
    const currentQuestionIsTitleCard = playLesson.currentQuestion.type === 'TL'
    const currentQuestionIsNotFirstQuestion = calculatedAnsweredQuestionCount !== 0
    const displayedAnsweredQuestionCount = currentQuestionIsTitleCard && currentQuestionIsNotFirstQuestion ? calculatedAnsweredQuestionCount + 1 : calculatedAnsweredQuestionCount
    const answeredCount = previewMode ? this.getPreviewQuestionCount() : displayedAnsweredQuestionCount;
    const totalCount = previewMode ? playLesson.questionSet.length : questionCount(playLesson);

    return (<ProgressBar
      answeredQuestionCount={answeredCount}
      label='questions'
      percent={getProgressPercent({ playLesson, previewMode, questionToPreview })}
      questionCount={totalCount}
    />)
  }

  render() {
    const { sessionInitialized, error, sessionID, saved, session, isLastQuestion } = this.state
    const { conceptsFeedback, playLesson, dispatch, lessons, match, previewMode, onHandleToggleQuestion, questionToPreview } = this.props
    const { data, hasreceiveddata, } = lessons
    const { params } = match
    const { lessonID, } = params;
    let component;

    if (!(sessionInitialized && hasreceiveddata && data && data[lessonID] && playLesson && playLesson.questionSet)) {
      return (<div className="student-container student-container-diagnostic"><Spinner /></div>);
    }

    if (playLesson.currentQuestion) {
      const { type } = playLesson.currentQuestion;
      const question = this.getQuestion();
      if ((!previewMode && type === 'SF') || (previewMode && question.type === 'SF')) {
        component = (
          <PlaySentenceFragment
            conceptsFeedback={conceptsFeedback}
            currentKey={question.key}
            dispatch={dispatch}
            isLastQuestion={isLastQuestion}
            key={question.key}
            markIdentify={this.markIdentify}
            marking="diagnostic"
            nextQuestion={this.nextQuestion}
            onHandleToggleQuestion={onHandleToggleQuestion}
            previewMode={previewMode}
            question={question}
            questionToPreview={questionToPreview}
            updateAttempts={this.submitResponse}
          />
        );
      } else if ((!previewMode && type === 'FB') || (previewMode && question.type === 'FB')) {
        component = (
          <PlayFillInTheBlankQuestion
            conceptsFeedback={conceptsFeedback}
            dispatch={dispatch}
            isLastQuestion={isLastQuestion}
            key={question.key}
            nextQuestion={this.nextQuestion}
            onHandleToggleQuestion={onHandleToggleQuestion}
            prefill={this.getLesson().prefill}
            previewMode={previewMode}
            question={question}
            questionToPreview={questionToPreview}
            submitResponse={this.submitResponse}
          />
        );
      } else if ((!previewMode && type === 'TL') || (previewMode && question.title)){
        component = (
          <PlayTitleCard
            data={question}
            handleContinueClick={this.nextQuestion}
            isLastQuestion={isLastQuestion}
          />
        )
      } else {
        component = (
          <PlayLessonQuestion
            conceptsFeedback={conceptsFeedback}
            dispatch={dispatch}
            isAdmin={false}
            isLastQuestion={isLastQuestion}
            key={question.key}
            nextQuestion={this.nextQuestion}
            onHandleToggleQuestion={onHandleToggleQuestion}
            prefill={this.getLesson().prefill}
            previewMode={previewMode}
            question={question}
            questionToPreview={questionToPreview}
          />
        );
      }
    } else if (playLesson.answeredQuestions.length > 0 && (playLesson.unansweredQuestions.length === 0 && playLesson.currentQuestion === undefined)) {
      component = (
        <Finished
          data={playLesson}
          error={error}
          lessonID={params.lessonID}
          name={sessionID}
          previewMode={previewMode}
          saved={saved}
          saveToLMS={this.saveToLMS}
        />
      );
    } else {
      component = (
        <Register
          lesson={this.getLesson()}
          previewMode={previewMode}
          resumeActivity={this.resumeSession}
          session={session}
          startActivity={this.startActivity}
        />
      );
    }

    return (
      <div>
        <section className="section is-fullheight minus-nav student">
          {this.renderProgressBar()}
          <div className="student-container student-container-diagnostic">
            {component}
          </div>
        </section>
      </div>
    );
  }
}

function select(state) {
  return {
    lessons: state.lessons,
    questions: state.questions,
    sentenceFragments: state.sentenceFragments,
    playLesson: state.playLesson, // the questionReducer
    routing: state.routing,
    fillInBlank: state.fillInBlank,
    titleCards: state.titleCards,
    conceptsFeedback: state.conceptsFeedback
  };
}

export default withRouter(connect(select)(Lesson));
