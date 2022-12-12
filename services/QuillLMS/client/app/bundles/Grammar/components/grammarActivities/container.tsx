import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import * as _ from 'lodash';
import { Response } from 'quill-marking-logic';

import QuestionComponent from './question'
import Intro from './intro'
import TurkCodePage from './turkCodePage'

import getParameterByName from '../../helpers/getParameterByName';
import { getActivity } from "../../actions/grammarActivities";
import {
  updateSession,
  getQuestionsForConcepts,
  getQuestions,
  goToNextQuestion,
  checkAnswer,
  startListeningToFollowUpQuestionsForProofreaderSession,
  startNewSession,
} from "../../actions/session";
import { startListeningToConceptsFeedback } from '../../actions/conceptsFeedback'
import { startListeningToConcepts } from '../../actions/concepts'
import { startListeningToQuestions } from '../../actions/questions'
import { getConceptResultsForAllQuestions, calculateScoreForLesson } from '../../helpers/conceptResultsGenerator'
import { SessionState } from '../../reducers/sessionReducer'
import { GrammarActivityState } from '../../reducers/grammarActivitiesReducer'
import { ConceptsFeedbackState } from '../../reducers/conceptsFeedbackReducer'
import { Question, FormattedConceptResult } from '../../interfaces/questions'
import LoadingSpinner from '../shared/loading_spinner'
import {
  roundValuesToSeconds,
  KEYDOWN,
  MOUSEMOVE,
  MOUSEDOWN,
  CLICK,
  KEYPRESS,
  VISIBILITYCHANGE,
  SCROLL,
} from '../../../Shared/index'
import { requestPut, requestPost, } from '../../../../modules/request/index'

interface PlayGrammarContainerState {
  showTurkCode: boolean;
  saved: boolean;
  error: boolean;
  saving: boolean;
  introSkipped: boolean;
  startTime: number;
  isIdle: boolean;
  timeTracking: { [key:string]: number };
}

interface PlayGrammarContainerProps {
  grammarActivities: GrammarActivityState;
  conceptsFeedback: ConceptsFeedbackState;
  session: SessionState;
  dispatch: Function;
  previewMode: boolean;
  questionToPreview: Question;
  questions: Question[];
  handleToggleQuestion: (question: Question) => void;
  skippedToQuestionFromIntro: boolean;
  isOnMobile: boolean;
  handleTogglePreviewMenu: () => void;
}

export class PlayGrammarContainer extends React.Component<PlayGrammarContainerProps, PlayGrammarContainerState> {
  constructor(props: any) {
    super(props);

    this.state = {
      showTurkCode: false,
      saving: false,
      saved: false,
      error: false,
      introSkipped: false,
      startTime: Date.now(),
      isIdle: false,
      timeTracking: {}
    }

    const { dispatch, previewMode } = props
    dispatch(startListeningToConceptsFeedback());
    dispatch(startListeningToConcepts());

    const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href)
    const sessionIdentifier = getParameterByName('student', window.location.href) || proofreaderSessionId
    const activityUID = getParameterByName('uid', window.location.href)
    dispatch(getActivity(activityUID))

    if (sessionIdentifier && !previewMode) {
      dispatch(startListeningToQuestions(sessionIdentifier));
    } else {
      dispatch(startListeningToQuestions());
      dispatch(startNewSession())
    }

    if (proofreaderSessionId) {
      dispatch(startListeningToFollowUpQuestionsForProofreaderSession(proofreaderSessionId))
    }

    window.addEventListener(KEYDOWN, this.resetTimers)
    window.addEventListener(MOUSEMOVE, this.resetTimers)
    window.addEventListener(MOUSEDOWN, this.resetTimers)
    window.addEventListener(CLICK, this.resetTimers)
    window.addEventListener(KEYPRESS, this.resetTimers)
    window.addEventListener(SCROLL, this.resetTimers)
    window.addEventListener(VISIBILITYCHANGE, this.setIdle)
  }

  componentDidUpdate(prevProps) {
    const { timeTracking, introSkipped, saved, saving, } = this.state
    const { previewMode, questions, questionToPreview, grammarActivities, session, skippedToQuestionFromIntro, dispatch, handleToggleQuestion, } = this.props;
    const { hasreceiveddata } = grammarActivities

    if (saved || saving) { return }

    const activityUID = getParameterByName('uid', window.location.href)

    if (prevProps.grammarActivities.hasreceiveddata != hasreceiveddata && hasreceiveddata) {
      document.title = `Quill.org | ${grammarActivities.currentActivity.title}`
    }

    if (!hasreceiveddata && activityUID) {
      dispatch(getActivity(activityUID))
    }

    if (!_.isEqual(prevProps.session.timeTracking, session.timeTracking)) {
      this.setState({ timeTracking: session.timeTracking || timeTracking })
    }

    if (hasreceiveddata && grammarActivities.currentActivity && !session.hasreceiveddata && !session.pending && !session.error) {
      const { questions, concepts, flag } = grammarActivities.currentActivity
      if (questions && questions.length) {
        dispatch(getQuestions(questions, flag))
      } else {
        dispatch(getQuestionsForConcepts(concepts, flag))
      }
    }

    if (session.hasreceiveddata && !session.currentQuestion && session.unansweredQuestions.length === 0 && session.answeredQuestions.length > 0) {
      this.saveToLMS(session)
      // handles case where proofreader has no follow-up questions
    } else if (session.hasreceiveddata && !session.currentQuestion && session.unansweredQuestions.length === 0 && session.proofreaderSession) {
      this.saveToLMS(session)
    }

    if (hasreceiveddata && grammarActivities.currentActivity && !session.hasreceiveddata && !session.pending && !session.error) {
      const { questions, concepts, flag } = grammarActivities.currentActivity
      if (questions && questions.length) {
        dispatch(getQuestions(questions, flag))
      } else {
        dispatch(getQuestionsForConcepts(concepts, flag))
      }
    }

    if (session.hasreceiveddata && !session.currentQuestion && session.unansweredQuestions.length === 0 && session.answeredQuestions.length > 0) {
      this.saveToLMS(session)
      // handles case where proofreader has no follow-up questions
    } else if (session.hasreceiveddata && !session.currentQuestion && session.unansweredQuestions.length === 0 && session.proofreaderSession) {
      this.saveToLMS(session)
    }

    const sessionID = getParameterByName('student', window.location.href)
    const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href)
    const sessionIdentifier = sessionID || proofreaderSessionId
    // eslint-disable-next-line react/destructuring-assignment
    if (sessionIdentifier && !_.isEqual(session, prevProps.session) && !session.pending && session.hasreceiveddata) {
      updateSession(sessionIdentifier, {...session, timeTracking, })
    }
    if(previewMode && questions && session.currentQuestion && !questionToPreview) {
      const uid = session.currentQuestion.uid;
      const question = questions[uid];
      handleToggleQuestion(question);
    }
    if(previewMode && !introSkipped && skippedToQuestionFromIntro) {
      this.setState({ introSkipped: true });
      this.goToNextQuestion();
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

  determineActiveStepForTimeTracking(session) {
    const { currentQuestion, answeredQuestions, } = session

    if (!currentQuestion) { return 'landing' }

    return `prompt_${answeredQuestions.length + 1}`
  }

    resetTimers = (e=null) => {
      const now = Date.now()
      this.setState((prevState, props) => {
        const { startTime, timeTracking, isIdle, inactivityTimer, } = prevState
        const { session, } = props
        const activeStep = this.determineActiveStepForTimeTracking(session)

        if (inactivityTimer) { clearTimeout(inactivityTimer) }

        let elapsedTime = now - startTime
        if (isIdle || !session.questionSet) {
          elapsedTime = 0
        }
        const newTimeTracking = {...timeTracking, [activeStep]: (timeTracking[activeStep] || 0) + elapsedTime}
        const newInactivityTimer = setTimeout(this.setIdle, 30000);  // time is in milliseconds (1000 is 1 second)

        return { timeTracking: newTimeTracking, isIdle: false, inactivityTimer: newInactivityTimer, startTime: now, }
      })

      return Promise.resolve(true);
    }

    setIdle = () => { this.resetTimers().then(() => this.setState({ isIdle: true })) }


    saveToLMS = (questions: SessionState) => {
      const { timeTracking, } = this.state
      const { session, previewMode } = this.props
      const { answeredQuestions } = questions
      const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href)
      const score = calculateScoreForLesson(answeredQuestions);
      const activityUID = getParameterByName('uid', window.location.href)
      const sessionID = getParameterByName('student', window.location.href)
      let results

      this.setState({ saving: true, })

      const data = { time_tracking: roundValuesToSeconds(timeTracking), }

      if (window.location.href.includes('turk')) {
        this.setState({showTurkCode: true})
      }
      if (proofreaderSessionId) {
        const { proofreaderSession } = session
        const proofreaderConceptResults = proofreaderSession.conceptResults
        const numberOfGrammarQuestions = answeredQuestions.length
        const numberOfProofreaderQuestions = proofreaderConceptResults.length
        const correctProofreaderQuestions = proofreaderConceptResults.filter(cr => cr.metadata.correct === 1)
        const proofreaderScore = correctProofreaderQuestions.length / numberOfProofreaderQuestions
        let proofreaderAndGrammarResults = proofreaderConceptResults
        let totalScore = proofreaderScore
        if (numberOfGrammarQuestions) {
          results = getConceptResultsForAllQuestions(answeredQuestions, numberOfProofreaderQuestions);
          proofreaderAndGrammarResults = proofreaderConceptResults.concat(results)
          totalScore = ((proofreaderScore * numberOfProofreaderQuestions) + (score * numberOfGrammarQuestions)) / (numberOfGrammarQuestions + numberOfProofreaderQuestions)
        }
        if (proofreaderSession.anonymous) {
          const proofreaderActivityUID = proofreaderSession.activityUID
          this.createAnonActivitySession(proofreaderActivityUID, proofreaderAndGrammarResults, totalScore, data)
        } else if(!previewMode) {
          this.finishActivitySession(proofreaderSessionId, proofreaderAndGrammarResults, totalScore, data)
        }
      } else {
        results = getConceptResultsForAllQuestions(answeredQuestions);
        if (sessionID && !previewMode) {
          this.finishActivitySession(sessionID, results, score, data);
        } else if (activityUID) {
          this.createAnonActivitySession(activityUID, results, score, data);
        }
      }
    }

    finishActivitySession = (sessionID: string, results: FormattedConceptResult[], score: number, data) => {
      requestPut(
        `${process.env.DEFAULT_URL}/api/v1/activity_sessions/${sessionID}`,
        {
          state: 'finished',
          concept_results: results,
          percentage: score,
          data
        },
        (body) => {
          document.location.href = `${process.env.DEFAULT_URL}/activity_sessions/${body.activity_session.uid}`;
          this.setState({ saved: true, });
        },
        (body) => {
          this.setState({
            saved: false,
            error: true,
          });
        }
      )
    }

    createAnonActivitySession = (lessonID: string, results: FormattedConceptResult[], score: number, data) => {
      const { showTurkCode, } = this.state;
      const { previewMode } = this.props;

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
          if (!showTurkCode && !previewMode) {
            document.location.href = `${process.env.DEFAULT_URL}/activity_sessions/${body.activity_session.uid}`;
          }
        }
      )
    }

    checkAnswer = (response: string, question: Question, responses: Response[], isFirstAttempt: Boolean) => {
      const { dispatch, } = this.props
      dispatch(checkAnswer(response, question, responses, isFirstAttempt))
    }

    goToNextQuestion = () => {
      const { dispatch, } = this.props
      this.resetTimers()
      dispatch(goToNextQuestion())
    }

    render(): JSX.Element {
      const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href)
      const { showTurkCode, saving, } = this.state
      const { dispatch, grammarActivities, session, concepts, conceptsFeedback, previewMode, questions, handleToggleQuestion, isOnMobile, handleTogglePreviewMenu } = this.props
      if (showTurkCode) {
        return <TurkCodePage />
      }

      if ((grammarActivities.hasreceiveddata || proofreaderSessionId) && session.hasreceiveddata) {

        if (session.currentQuestion) {
          return (
            <QuestionComponent
              activity={grammarActivities ? grammarActivities.currentActivity : null}
              answeredQuestions={session.answeredQuestions}
              checkAnswer={this.checkAnswer}
              concepts={concepts}
              conceptsFeedback={conceptsFeedback}
              currentQuestion={session.currentQuestion}
              dispatch={dispatch}
              goToNextQuestion={this.goToNextQuestion}
              handleTogglePreviewMenu={handleTogglePreviewMenu}
              handleToggleQuestion={handleToggleQuestion}
              isOnMobile={isOnMobile}
              previewMode={previewMode}
              questions={questions}
              questionSet={session.questionSet}
              unansweredQuestions={session.unansweredQuestions}
            />
          )
        }
        if (saving || (!grammarActivities && !proofreaderSessionId)) { return <LoadingSpinner /> }
        return <Intro activity={grammarActivities.currentActivity} previewMode={previewMode} session={session} startActivity={this.goToNextQuestion} />
      }

      if (session.error) {
        return (
          <div>{session.error}</div>
        );
      }

      return <LoadingSpinner />
    }
}

const mapStateToProps = (state: any) => {
  return {
    grammarActivities: state.grammarActivities,
    session: state.session,
    conceptsFeedback: state.conceptsFeedback,
    concepts: state.concepts,
    questions: state.questions.data
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayGrammarContainer);
