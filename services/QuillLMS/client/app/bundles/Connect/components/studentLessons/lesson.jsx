import Pusher from 'pusher-js';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import PlayFillInTheBlankQuestion from './fillInBlank.tsx';
import Finished from './finished.jsx';
import PlayLessonQuestion from './question';
import PlaySentenceFragment from './sentenceFragment.jsx';

import { requestPost, requestPut, } from '../../../../modules/request/index';
import {
  CLICK,
  ENGLISH,
  KEYDOWN,
  KEYPRESS,
  LanguageSelectionPage,
  MOUSEDOWN,
  MOUSEMOVE,
  PlayTitleCard,
  ProgressBar,
  Register,
  SCROLL,
  Spinner,
  TeacherPreviewMenuButton,
  VISIBILITYCHANGE,
  roundValuesToSeconds,
} from '../../../Shared/index';
import { clearData, loadData, nextQuestion, resumePreviousSession, setCurrentQuestion, submitResponse, updateCurrentQuestion } from '../../actions.js';
import SessionActions from '../../actions/sessions.js';
import LessonActions from '../../actions/lessons';
import ConceptsFeedbackActions from '../../actions/concepts-feedback.ts'
import {
  answeredQuestionCount,
  getProgressPercent,
  questionCount
} from '../../libs/calculateProgress';
import { calculateScoreForLesson, getConceptResultsForAllQuestions } from '../../libs/conceptResults/lesson';
import { permittedFlag } from '../../libs/flagArray';
import { getParameterByName } from '../../libs/getParameterByName';

const TITLE_CARD_TYPE = "TL"

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
      lessonLoaded: false,
      startTime: Date.now(),
      isIdle: false,
      timeTracking: {}
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(clearData());

    window.addEventListener(KEYDOWN, this.resetTimers)
    window.addEventListener(MOUSEMOVE, this.resetTimers)
    window.addEventListener(MOUSEDOWN, this.resetTimers)
    window.addEventListener(CLICK, this.resetTimers)
    window.addEventListener(KEYPRESS, this.resetTimers)
    window.addEventListener(SCROLL, this.resetTimers)
    window.addEventListener(VISIBILITYCHANGE, this.setIdle)
  }

  //TODO: refactor into componentDidUpdate

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { timeTracking, } = this.state
    const { playLesson, } = this.props
    const answeredQuestionsHasChanged = nextProps.playLesson.answeredQuestions.length !== playLesson.answeredQuestions.length
    const nextPropsAttemptsLength = nextProps.playLesson.currentQuestion && nextProps.playLesson.currentQuestion.question && nextProps.playLesson.currentQuestion.question.attempts ? nextProps.playLesson.currentQuestion.question.attempts.length : 0
    const thisPropsAttemptsLength = playLesson.currentQuestion && playLesson.currentQuestion.question &&  playLesson.currentQuestion.question.attempts ? playLesson.currentQuestion.question.attempts.length : 0
    const attemptsHasChanged = nextPropsAttemptsLength !== thisPropsAttemptsLength
    if (answeredQuestionsHasChanged || attemptsHasChanged) {
      this.saveSessionData({...nextProps.playLesson, timeTracking });
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
      SessionActions.populateQuestions(TITLE_CARD_TYPE, titleCards.data);
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
      if (lessonLoaded && playLesson?.language && playLesson.language !== prevProps?.playLesson?.language) {
        dispatch(LessonActions.loadTranslatedQuestions(lessonID, playLesson.language))
        dispatch(ConceptsFeedbackActions.loadTranslatedConceptsFeedback(playLesson.language))
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener(KEYDOWN, this.resetTimers)
    window.removeEventListener(MOUSEMOVE, this.resetTimers)
    window.removeEventListener(MOUSEDOWN, this.resetTimers)
    window.removeEventListener(CLICK, this.resetTimers)
    window.removeEventListener(KEYPRESS, this.resetTimers)
    window.removeEventListener(SCROLL, this.resetTimers)
    window.removeEventListener(VISIBILITYCHANGE, this.setIdle)
  }

  dataHasLoaded() {
    const { sessionInitialized, } = this.state
    const { playLesson, lessons, match, } = this.props
    const { data, hasreceiveddata, } = lessons
    const { params } = match
    const { lessonID, } = params;

    return (sessionInitialized && hasreceiveddata && data && data[lessonID] && playLesson && playLesson.questionSet)
  }

  determineActiveStepForTimeTracking(playLesson) {
    const { currentQuestion, answeredQuestions, } = playLesson

    if (!currentQuestion) { return 'landing' }

    const finishedTitleCards = answeredQuestions.filter(q => q.type === TITLE_CARD_TYPE)
    const finishedQuestions = answeredQuestions.filter(q => q.type !== TITLE_CARD_TYPE)

    if (currentQuestion.type === TITLE_CARD_TYPE) { return `title_card_${finishedTitleCards.length + 1}`}
    if (currentQuestion.type !== TITLE_CARD_TYPE) { return `prompt_${finishedQuestions.length + 1}`}
  }

  resetTimers = (e=null) => {
    const now = Date.now()
    this.setState((prevState, props) => {
      const { startTime, timeTracking, isIdle, inactivityTimer, completedSteps, } = prevState
      const { playLesson, } = props
      const activeStep = this.determineActiveStepForTimeTracking(playLesson)

      if (inactivityTimer) { clearTimeout(inactivityTimer) }

      let elapsedTime = now - startTime
      if (isIdle || !this.dataHasLoaded()) {
        elapsedTime = 0
      }
      const newTimeTracking = {...timeTracking, [activeStep]: (timeTracking[activeStep] || 0) + elapsedTime}
      const newInactivityTimer = setTimeout(this.setIdle, 30000);  // time is in milliseconds (1000 is 1 second)

      return { timeTracking: newTimeTracking, isIdle: false, inactivityTimer: newInactivityTimer, startTime: now, }
    })

    return Promise.resolve(true);
  }

  setIdle = () => { this.resetTimers().then(() => this.setState({ isIdle: true })) }

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
    const { playLesson, questions } = this.props;
    const { translated_questions } = questions
    const { currentQuestion, language } = playLesson
    const { question } = currentQuestion;
    const { key, uid } = question
    const keyOrUid = key || uid
    if (translated_questions && language && language !== ENGLISH && keyOrUid) {
      const question_translation = translated_questions[keyOrUid]
      return { ...question, translation: question_translation };
    }
    return question;
  }

  initializeSubscription(activitySessionUid) {
    if (process.env.NODE_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    if (!window.pusher) {
      window.pusher = new Pusher(process.env.PUSHER_KEY, { cluster: process.env.PUSHER_CLUSTER });
    }
    const channel = window.pusher.subscribe(activitySessionUid);

    channel.bind('concept-results-saved', () => {
      document.location.href = `${process.env.DEFAULT_URL}/activity_sessions/${activitySessionUid}`;
      this.setState({ saved: true, });
    });

    channel.bind('concept-results-partially-saved', () => {
      document.location.href = process.env.DEFAULT_URL;
    });
  }


  createAnonActivitySession = (lessonID, results, score, data) => {
    requestPost(
      `${process.env.DEFAULT_URL}/api/v1/activity_sessions/`,
      {
        state: 'finished',
        activity_uid: lessonID,
        concept_results: results,
        percentage: score,
        data
      },
      (body) => {
        this.initializeSubscription(body.activity_session.uid)
      }
    )
  }

  finishActivitySession = (sessionID, results, score, data) => {
    this.initializeSubscription(sessionID)

    requestPut(
      `${process.env.DEFAULT_URL}/api/v1/activity_sessions/${sessionID}`,
      {
        state: 'finished',
        concept_results: results,
        percentage: score,
        data
      },
      (body) => {
        // doing nothing here because the Pusher subscription should handle a redirect once concept results are saved
      },
      (body) => {
        this.setState({
          saved: false,
          error: body.meta.message,
        });
      }
    )
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
    const { dispatch, previewMode, handleToggleQuestion } = this.props;
    this.resetTimers()
    if(previewMode) {
      const questionObject = this.getNextPreviewQuestion();
      if(questionObject && questionObject.question) {
        const { question } = questionObject
        handleToggleQuestion(question)
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
          type = TITLE_CARD_TYPE
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
        const { timeTracking, } = this.state
        SessionActions.get(sessionID, (data) => {
          if (data) {
            this.setState({ session: data, timeTracking: data.timeTracking || timeTracking });
          }
        });
      }
    });
  }

  saveToLMS = () => {
    const { playLesson, match, previewMode } = this.props
    const { params } = match
    const { sessionID, timeTracking, } = this.state
    const { lessonID, } = params;
    this.setState({ error: false, });
    const relevantAnsweredQuestions = playLesson.answeredQuestions.filter(q => q.questionType !== TITLE_CARD_TYPE)
    const results = getConceptResultsForAllQuestions(relevantAnsweredQuestions);
    const score = calculateScoreForLesson(relevantAnsweredQuestions);
    const data = { time_tracking: roundValuesToSeconds(timeTracking), }
    if (sessionID && !previewMode) {
      this.finishActivitySession(sessionID, results, score, data);
    } else {
      this.createAnonActivitySession(lessonID, results, score, data);
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
    const currentQuestionIsTitleCard = playLesson.currentQuestion.type === TITLE_CARD_TYPE
    const currentQuestionIsNotFirstQuestion = calculatedAnsweredQuestionCount !== 0
    const displayedAnsweredQuestionCount = currentQuestionIsTitleCard && currentQuestionIsNotFirstQuestion ? calculatedAnsweredQuestionCount + 1 : calculatedAnsweredQuestionCount
    const answeredCount = previewMode ? this.getPreviewQuestionCount() : displayedAnsweredQuestionCount;
    const totalCount = previewMode ? playLesson.questionSet.length : questionCount(playLesson);

    return (
      <ProgressBar
        answeredQuestionCount={answeredCount}
        label='questions'
        percent={getProgressPercent({ playLesson, previewMode, questionToPreview })}
        questionCount={totalCount}
      />
    )
  }

  render() {
    const { sessionInitialized, error, sessionID, saved, session, isLastQuestion } = this.state
    const { conceptsFeedback, playLesson, dispatch, lessons, match, previewMode, handleToggleQuestion, questionToPreview, handleTogglePreview, isOnMobile, availableLanguages, updateLanguage, language, translate } = this.props
    const { data, hasreceiveddata, } = lessons
    const { params } = match
    const { lessonID, } = params;
    const studentSession = getParameterByName('student', window.location.href);
    const showTranslation = language && availableLanguages?.includes(language) && language !== ENGLISH
    let component;

    if (!this.dataHasLoaded()) {
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
            onHandleToggleQuestion={handleToggleQuestion}
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
            onHandleToggleQuestion={handleToggleQuestion}
            prefill={this.getLesson().prefill}
            previewMode={previewMode}
            question={question}
            questionToPreview={questionToPreview}
            showTranslation={showTranslation}
            submitResponse={this.submitResponse}
            translate={translate}
          />
        );
      } else if ((!previewMode && type === TITLE_CARD_TYPE) || (previewMode && question.title)){
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
            onHandleToggleQuestion={handleToggleQuestion}
            prefill={this.getLesson().prefill}
            previewMode={previewMode}
            question={question}
            questionToPreview={questionToPreview}
            showTranslation={showTranslation}
            translate={translate}
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
          showTranslation={showTranslation}
          translate={translate}
        />
      );
    } else if (availableLanguages?.length > 1 && !language) {
      component = (<LanguageSelectionPage
        dispatch={dispatch}
        handlePageLoaded={this.onLanguagePageLoad}
        languages={availableLanguages}
        previewMode={previewMode}
        setLanguage={updateLanguage}
      />);
    } else {
      component = (
        <Register
          language={this.props.playLesson?.language}
          lesson={this.getLesson()}
          previewMode={previewMode}
          resumeActivity={this.resumeSession}
          session={session}
          showTranslation={showTranslation}
          startActivity={this.startActivity}
          translate={translate}
        />
      );
    }

    return (
      <div>
        <section className="section is-fullheight minus-nav student">
          {isOnMobile && !studentSession && <TeacherPreviewMenuButton containerClass="is-on-mobile" handleTogglePreview={handleTogglePreview} />}
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
