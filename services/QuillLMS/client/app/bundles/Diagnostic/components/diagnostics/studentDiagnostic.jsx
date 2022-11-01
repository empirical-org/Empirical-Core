import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import FinishedDiagnostic from './finishedDiagnostic.jsx';
import LandingPage from './landing.jsx';
import PlaySentenceFragment from './sentenceFragment.jsx';
import PlayDiagnosticQuestion from './sentenceCombining.jsx';

import PlayFillInTheBlankQuestion from '../fillInBlank/playFillInTheBlankQuestion';
import {
  CarouselAnimation,
  SmartSpinner,
  PlayTitleCard,
  ProgressBar,
  hashToCollection,
  TeacherPreviewMenuButton,
  roundValuesToSeconds,
  KEYDOWN,
  MOUSEMOVE,
  MOUSEDOWN,
  CLICK,
  KEYPRESS,
  VISIBILITYCHANGE,
  SCROLL,
} from '../../../Shared/index';
import SessionActions from '../../actions/sessions.js';
import { clearData, loadData, nextQuestion, submitResponse, updateCurrentQuestion, resumePreviousDiagnosticSession, setCurrentQuestion, setDiagnosticID } from '../../actions/diagnostics.js';
import { getConceptResultsForAllQuestions } from '../../libs/conceptResults/diagnostic';
import { getParameterByName } from '../../libs/getParameterByName';
import {
  questionCount,
  answeredQuestionCount,
  getProgressPercent
} from '../../libs/calculateProgress'
import { requestPut, requestPost, } from '../../../../modules/request/index'

const TITLE_CARD_TYPE = "TL"

// TODO: triage issue with missing title cards. Currently, we have to dipatch data from this.questionsForLesson() to the loadData action in
// three different places to ensure that preview mode always works: componentDidMount, onSpinnerMount & startActivity. Without these three calls,
// sometimes the spinner will hang at 50% or the user will be unable to click title card questions.

export class StudentDiagnostic extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      saved: false,
      sessionID: this.getSessionId(),
      hasOrIsGettingResponses: false,
      startTime: Date.now(),
      isIdle: false,
      timeTracking: {}
    }
  }

  componentDidMount() {
    const { sessionID } = this.state;
    const { dispatch, match, lessons } = this.props;
    const { params } = match;
    const { diagnosticID } = params;

    document.title = `Quill.org | ${lessons.data[diagnosticID].name}`

    dispatch(clearData());
    dispatch(setDiagnosticID({ diagnosticID }))
    if (sessionID) {
      const { timeTracking, } = this.state
      SessionActions.get(sessionID, (data) => {
        if (data) {
          this.setState({ session: data, timeTracking: data.timeTracking || timeTracking });
        }
      });
    }
    const data = this.questionsForLesson()
    const action = loadData(data);
    dispatch(action);

    window.addEventListener(KEYDOWN, this.resetTimers)
    window.addEventListener(MOUSEMOVE, this.resetTimers)
    window.addEventListener(MOUSEDOWN, this.resetTimers)
    window.addEventListener(CLICK, this.resetTimers)
    window.addEventListener(KEYPRESS, this.resetTimers)
    window.addEventListener(SCROLL, this.resetTimers)
    window.addEventListener(VISIBILITYCHANGE, this.setIdle)
  }

  componentDidUpdate(prevProps) {
    const { timeTracking, } = this.state
    const { skippedToQuestionFromIntro, previewMode, playDiagnostic } = this.props;

    if(previewMode && skippedToQuestionFromIntro !== prevProps.skippedToQuestionFromIntro) {
      this.startActivity();
    }
    if (prevProps.playDiagnostic.answeredQuestions.length !== playDiagnostic.answeredQuestions.length) {
      this.saveSessionData({ ...playDiagnostic, timeTracking, });
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

  determineActiveStepForTimeTracking(playDiagnostic) {
    const { currentQuestion, answeredQuestions, } = playDiagnostic

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
      const { playDiagnostic, } = props
      const activeStep = this.determineActiveStepForTimeTracking(playDiagnostic)

      if (inactivityTimer) { clearTimeout(inactivityTimer) }

      let elapsedTime = now - startTime
      if (isIdle || !playDiagnostic.questionSet) {
        elapsedTime = 0
      }
      const newTimeTracking = {...timeTracking, [activeStep]: (timeTracking[activeStep] || 0) + elapsedTime}
      const newInactivityTimer = setTimeout(this.setIdle, 30000);  // time is in milliseconds (1000 is 1 second)

      return { timeTracking: newTimeTracking, isIdle: false, inactivityTimer: newInactivityTimer, startTime: now, }
    })

    return Promise.resolve(true);
  }

  setIdle = () => { this.resetTimers().then(() => this.setState({ isIdle: true })) }

  getPreviousSessionData = () => {
    const { session, } = this.state
    return session;
  }

  resumeSession = (data) => {
    const { dispatch, } = this.props
    if (data) {
      dispatch(resumePreviousDiagnosticSession(data));
    }
  }

  getSessionId = () => {
    let sessionID = getParameterByName('student');
    if (sessionID === 'null') {
      sessionID = undefined;
    }
    return sessionID;
  }

  saveSessionData = (lessonData) => {
    const { sessionID, } = this.state
    if (!sessionID) { return }

    SessionActions.update(sessionID, lessonData);
  }

  doesNotHaveAndIsNotGettingResponses = () => {
    const { hasOrIsGettingResponses, } = this.state
    return (!hasOrIsGettingResponses);
  }

  hasQuestionsInQuestionSet = (props) => {
    const pL = props.playDiagnostic;
    return (pL && pL.questionSet && pL.questionSet.length);
  }

  saveToLMS = () => {
    const { sessionID, timeTracking, } = this.state
    const { playDiagnostic, match } = this.props
    const { params } = match
    const { diagnosticID } = params

    this.setState({ error: false, });

    const relevantAnsweredQuestions = playDiagnostic.answeredQuestions.filter(q => q.questionType !== TITLE_CARD_TYPE)
    const results = getConceptResultsForAllQuestions(relevantAnsweredQuestions);
    const data = { time_tracking: roundValuesToSeconds(timeTracking), }

    if (sessionID) {
      this.finishActivitySession(sessionID, results, 1, data);
    } else {
      this.createAnonActivitySession(diagnosticID, results, 1, data);
    }
  }

  finishActivitySession = (sessionID, results, score, data) => {
    requestPut(
      `${process.env.DEFAULT_URL}/api/v1/activity_sessions/${sessionID}`,
      {
        state: 'finished',
        concept_results: results,
        percentage: score,
        data
      },
      (body) => {
        document.location.href = process.env.DEFAULT_URL;
        this.setState({ saved: true, });
      },
      (body) => {
        this.setState({
          saved: false,
          error: body.meta.message,
        });
      }
    )
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
        document.location.href = process.env.DEFAULT_URL;
        this.setState({ saved: true, });
      }
    )
  }

  submitResponse = (response) => {
    const { dispatch, } = this.props
    const action = submitResponse(response);
    dispatch(action);
  }

  questionsForDiagnostic = () => {
    const { questions, lessons, match, } = this.props
    const questionsCollection = hashToCollection(questions.data);
    const { data, } = lessons
    const { params } = match
    const { lessonID, } = params
    return data[lessonID].questions.map(id => _.find(questionsCollection, { key: id, }));
  }

  startActivity = () => {
    const { dispatch, previewMode, skippedToQuestionFromIntro, questionToPreview, } = this.props

    const data = this.questionsForLesson()
    const action = loadData(data);
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

  handleSpinnerMount = () => {
    const { dispatch, } = this.props

    const data = this.questionsForLesson();
    const action = loadData(data);
    dispatch(action);
  }

  nextQuestion = () => {
    const { dispatch, playDiagnostic, previewMode } = this.props;
    const { unansweredQuestions } = playDiagnostic;

    this.resetTimers()
    // we set the current question here; otherwise, the attempts will be reset if the next question has already been answered
    if(previewMode) {
      const question = unansweredQuestions[0].data;
      const action = setCurrentQuestion(question);
      dispatch(action);
    } else {
      const next = nextQuestion();
      dispatch(next);
    }
  }

  getLesson = () => {
    const { lessons, match } = this.props
    const { data } = lessons
    const { params } = match
    const { diagnosticID } = params
    return data[diagnosticID];
  }

  questionsForLesson = () => {
    const { lessons, match } = this.props
    const { params } = match
    const { data, } = lessons
    const { diagnosticID, } = params
    const filteredQuestions = data[diagnosticID].questions.filter(ques => {
      return this.props[ques.questionType] ? this.props[ques.questionType].data[ques.key] : null  // eslint-disable-line react/destructuring-assignment
    }
    );
    // this is a quickfix for missing questions -- if we leave this in here
    // long term, we should return an array through a forloop to
    // cut the time from 2N to N
    return filteredQuestions.map((questionItem) => {
      const questionType = questionItem.questionType;
      const key = questionItem.key;
      const question = this.props[questionType].data[key];  // eslint-disable-line react/destructuring-assignment
      question.key = key;
      question.attempts = question.attempts ? question.attempts : []
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
      return { type, data: question, };
    });
  }

  getQuestionCount = () => {
    const { match } = this.props
    const { params } = match
    const { diagnosticID } = params
    if (diagnosticID == 'researchDiagnostic') {
      return '15';
    }
    return '22';
  }

  markIdentify = (bool) => {
    const { dispatch, } = this.props
    const action = updateCurrentQuestion({ identified: bool, });
    dispatch(action);
  }

  getQuestionType = (type) => {
    let questionType
    switch (type) {
      case 'questions':
        questionType = 'SC'
        break
      case 'fillInBlanks':
        questionType = 'FB'
        break
      case 'titleCards':
        questionType = TITLE_CARD_TYPE
        break
      case 'sentenceFragments':
        questionType = 'SF'
        break
    }
    return questionType
  }

  landingPageHtml = () => {
    const { lessons, match } = this.props
    const { params } = match
    const { data } = lessons
    const { diagnosticID, } = params;
    return data[diagnosticID].landingPageHtml
  }

  renderProgressBar = () => {
    const { playDiagnostic, } = this.props
    if (!playDiagnostic.currentQuestion) { return }

    const calculatedAnsweredQuestionCount = answeredQuestionCount(playDiagnostic)

    const currentQuestionIsTitleCard = playDiagnostic.currentQuestion.type === TITLE_CARD_TYPE
    const currentQuestionIsNotFirstQuestion = calculatedAnsweredQuestionCount !== 0

    const displayedAnsweredQuestionCount = currentQuestionIsTitleCard && currentQuestionIsNotFirstQuestion ? calculatedAnsweredQuestionCount + 1 : calculatedAnsweredQuestionCount

    const progressPercent = getProgressPercent(playDiagnostic);
    const totalQuestionCount = questionCount(playDiagnostic);

    return (
      <ProgressBar
        answeredQuestionCount={displayedAnsweredQuestionCount > totalQuestionCount ? totalQuestionCount : displayedAnsweredQuestionCount}
        label='questions'
        percent={progressPercent}
        questionCount={totalQuestionCount}
      />
    )
  }

  render() {
    const { playDiagnostic, dispatch, previewMode, isOnMobile, handleTogglePreview } = this.props
    const { error, saved, } = this.state
    let component;

    const isLastQuestion = playDiagnostic.unansweredQuestions.length === 0
    const studentSession = getParameterByName('student', window.location.href);

    if (!playDiagnostic.questionSet) {
      return (
        <div>
          <section className="section is-fullheight minus-nav student">
            <div className="student-container student-container-diagnostic">
              <SmartSpinner key="step2" message='Loading Your Lesson 50%' onMount={this.handleSpinnerMount} />
            </div>
          </section>
        </div>
      );
    }

    if (playDiagnostic.currentQuestion) {
      const questionType = playDiagnostic.currentQuestion.type || '';
      const question = playDiagnostic.currentQuestion.data;
      const key = playDiagnostic.currentQuestion.data.key;
      if (questionType === 'SC') {
        component = (<PlayDiagnosticQuestion
          dispatch={dispatch}
          isLastQuestion={isLastQuestion}
          key={key}
          marking="diagnostic"
          nextQuestion={this.nextQuestion}
          previewMode={previewMode}
          question={question}
        />);
      } else if (questionType === 'SF') {
        component = (<PlaySentenceFragment
          currentKey={key}
          dispatch={dispatch}
          isLastQuestion={isLastQuestion}
          key={key}
          markIdentify={this.markIdentify}
          nextQuestion={this.nextQuestion}
          previewMode={previewMode}
          question={question}
          updateAttempts={this.submitResponse}
        />);
      } else if (questionType === 'FB') {
        component = (<PlayFillInTheBlankQuestion
          currentKey={key}
          dispatch={dispatch}
          isLastQuestion={isLastQuestion}
          key={key}
          nextQuestion={this.nextQuestion}
          previewMode={previewMode}
          question={question}
        />)
      } else if (questionType === TITLE_CARD_TYPE) {
        component = (
          <PlayTitleCard
            currentKey={key}
            data={question}
            dispatch={dispatch}
            handleContinueClick={this.nextQuestion}
            isLastQuestion={isLastQuestion}
            previewMode={previewMode}
          />
        );
      }
    } else if (playDiagnostic.answeredQuestions.length > 0 && playDiagnostic.unansweredQuestions.length === 0) {
      component = (<FinishedDiagnostic
        error={error}
        saved={saved}
        saveToLMS={this.saveToLMS}
      />);
    } else {
      component = (<LandingPage
        begin={this.startActivity}
        landingPageHtml={this.landingPageHtml()}
        questionCount={this.getQuestionCount()}
        resumeActivity={this.resumeSession}
        session={this.getPreviousSessionData()}
      />);
    }
    return (
      <div>
        <section className="section is-fullheight minus-nav student">
          {isOnMobile && !studentSession && <TeacherPreviewMenuButton containerClass="is-on-mobile" handleTogglePreview={handleTogglePreview} />}
          {this.renderProgressBar()}
          <div className="student-container student-container-diagnostic">
            <CarouselAnimation>
              {component}
            </CarouselAnimation>
          </div>
        </section>
      </div>
    );
  }
}

function select(state) {
  return {
    routing: state.routing,
    questions: state.questions,
    playDiagnostic: state.playDiagnostic,
    sentenceFragments: state.sentenceFragments,
    fillInBlank: state.fillInBlank,
    sessions: state.sessions,
    lessons: state.lessons,
    titleCards: state.titleCards
  };
}
export default connect(select)(StudentDiagnostic);
