import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import * as request from 'request';
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
  removeSession
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

interface PlayGrammarContainerState {
  showTurkCode: boolean;
  saved: boolean;
  error: boolean;
  saving: boolean;
  introSkipped: boolean;
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
  switchedBackToPreview: boolean;
  randomizedQuestions: any[];
}

export class PlayGrammarContainer extends React.Component<PlayGrammarContainerProps, PlayGrammarContainerState> {
    constructor(props: any) {
      super(props);

      this.state = {
        showTurkCode: false,
        saving: false,
        saved: false,
        error: false,
        introSkipped: false
      }

      const { dispatch, previewMode } = props
      dispatch(startListeningToConceptsFeedback());
      dispatch(startListeningToConcepts());
      const activityUID = getParameterByName('uid', window.location.href)
      const sessionID = getParameterByName('student', window.location.href)
      const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href)

      if (sessionID && !previewMode) {
        dispatch(startListeningToQuestions(sessionID));
      } else {
        dispatch(startListeningToQuestions());
        dispatch(startNewSession())
      }

      if (activityUID) {
        dispatch(getActivity(activityUID))
      }

      if (proofreaderSessionId) {
        dispatch(startListeningToFollowUpQuestionsForProofreaderSession(proofreaderSessionId))
      }
    }

    //TODO: refactor into componentDidUpdate

    UNSAFE_componentWillReceiveProps(nextProps: PlayGrammarContainerProps) {
      const { previewMode, questions, questionToPreview, grammarActivities, session, skippedToQuestionFromIntro } = nextProps;
      const { dispatch, handleToggleQuestion } = this.props;
      const { introSkipped } = this.state;
      if (grammarActivities.hasreceiveddata && grammarActivities.currentActivity && !session.hasreceiveddata && !session.pending && !session.error) {
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
      // eslint-disable-next-line react/destructuring-assignment
      if (sessionID && !_.isEqual(session, this.props.session) && !session.pending && session.hasreceiveddata) {
        updateSession(sessionID, session)
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

    componentDidUpdate(prevProps) {
      const { grammarActivities } = this.props
      if (prevProps.grammarActivities != grammarActivities) {
        document.title = `Quill.org | ${grammarActivities.currentActivity.title}`
      }
    }

    saveToLMS = (questions: SessionState) => {
      const { session, previewMode } = this.props
      const { answeredQuestions } = questions
      const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href)
      const score = calculateScoreForLesson(answeredQuestions);
      const activityUID = getParameterByName('uid', window.location.href)
      const sessionID = getParameterByName('student', window.location.href)
      let results

      this.setState({ saving: true, })

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
          this.createAnonActivitySession(proofreaderActivityUID, proofreaderAndGrammarResults, totalScore)
        } else if(!previewMode) {
          this.finishActivitySession(proofreaderSessionId, proofreaderAndGrammarResults, totalScore)
        }
      } else {
        results = getConceptResultsForAllQuestions(answeredQuestions);
        if (sessionID && !previewMode) {
          this.finishActivitySession(sessionID, results, score);
        } else if (activityUID) {
          this.createAnonActivitySession(activityUID, results, score);
        }
      }
    }

    removeSession = () => {
      const sessionID = getParameterByName('student', window.location.href)
      const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href)
      removeSession(sessionID || proofreaderSessionId);
    }

    finishActivitySession = (sessionID: string, results: FormattedConceptResult[], score: number) => {
      request(
        { url: `${process.env.DEFAULT_URL}/api/v1/activity_sessions/${sessionID}`,
          method: 'PUT',
          json:
          {
            state: 'finished',
            concept_results: results,
            percentage: score,
          },
        },
        (err, httpResponse, body) => {
          if (httpResponse && httpResponse.statusCode === 200) {
            this.removeSession()
            document.location.href = `${process.env.DEFAULT_URL}/activity_sessions/${body.activity_session.uid}`;
            this.setState({ saved: true, });
          } else {
            this.setState({
              saved: false,
              error: true,
            });
          }
        }
      );
    }

    createAnonActivitySession = (lessonID: string, results: FormattedConceptResult[], score: number) => {
      const { showTurkCode, } = this.state;
      const { previewMode } = this.props;
      request(
        { url: `${process.env.DEFAULT_URL}/api/v1/activity_sessions/`,
          method: 'POST',
          json:
          {
            state: 'finished',
            activity_uid: lessonID,
            concept_results: results,
            percentage: score,
          },
        },
        (err, httpResponse, body) => {
          if (httpResponse && httpResponse.statusCode === 200) {
            this.removeSession()
            if (!showTurkCode && !previewMode) {
              document.location.href = `${process.env.DEFAULT_URL}/activity_sessions/${body.activity_session.uid}`;
            }
          }
        }
      );
    }

    checkAnswer = (response: string, question: Question, responses: Response[], isFirstAttempt: Boolean) => {
      const { dispatch, } = this.props
      dispatch(checkAnswer(response, question, responses, isFirstAttempt))
    }

    goToNextQuestion = () => {
      const { dispatch, } = this.props
      dispatch(goToNextQuestion())
    }

    render(): JSX.Element {
      const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href)
      const { showTurkCode, saving, } = this.state
      const { grammarActivities, session, concepts, conceptsFeedback, previewMode, questionToPreview, questions, handleToggleQuestion, switchedBackToPreview, randomizedQuestions, skippedToQuestionFromIntro } = this.props
      if (showTurkCode) {
        return <TurkCodePage />
      }

      if ((grammarActivities.hasreceiveddata || proofreaderSessionId) && session.hasreceiveddata) {

        if (session.currentQuestion) {
          return (<QuestionComponent
            activity={grammarActivities ? grammarActivities.currentActivity : null}
            answeredQuestions={session.answeredQuestions}
            checkAnswer={this.checkAnswer}
            concepts={concepts}
            conceptsFeedback={conceptsFeedback}
            currentQuestion={questionToPreview || session.currentQuestion}
            goToNextQuestion={this.goToNextQuestion}
            handleToggleQuestion={handleToggleQuestion}
            previewMode={previewMode}
            questions={questions}
            questionToPreview={questionToPreview}
            randomizedQuestions={randomizedQuestions}
            switchedBackToPreview={switchedBackToPreview}
            unansweredQuestions={session.unansweredQuestions}
          />)
        }
        if (saving) { return <LoadingSpinner /> }
        return <Intro activity={grammarActivities ? grammarActivities.currentActivity : null} previewMode={previewMode} session={session} startActivity={this.goToNextQuestion} />
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
