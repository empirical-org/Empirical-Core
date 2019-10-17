import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import * as request from 'request';
import * as _ from 'lodash';
import { Response } from 'quill-marking-logic'
import getParameterByName from '../../helpers/getParameterByName';
import { getActivity } from "../../actions/grammarActivities";
import {
  updateSessionOnFirebase,
  getQuestionsForConcepts,
  getQuestions,
  goToNextQuestion,
  checkAnswer,
  setSessionReducerToSavedSession,
  startListeningToFollowUpQuestionsForProofreaderSession,
  setSessionPending,
  removeGrammarSession,
  removeProofreaderSession
} from "../../actions/session";
import { startListeningToConceptsFeedback } from '../../actions/conceptsFeedback'
import { startListeningToConcepts } from '../../actions/concepts'
import { getConceptResultsForAllQuestions, calculateScoreForLesson } from '../../helpers/conceptResultsGenerator'
import { SessionState } from '../../reducers/sessionReducer'
import { GrammarActivityState } from '../../reducers/grammarActivitiesReducer'
import { ConceptsFeedbackState } from '../../reducers/conceptsFeedbackReducer'
import { Question, FormattedConceptResult } from '../../interfaces/questions'
import QuestionComponent from './question'
import TurkCodePage from './turkCodePage'
import LoadingSpinner from '../shared/loading_spinner'

interface PlayGrammarContainerState {
  showTurkCode: boolean;
  saved: boolean;
  error: boolean;
}

interface PlayGrammarContainerProps {
  grammarActivities: GrammarActivityState;
  conceptsFeedback: ConceptsFeedbackState;
  session: SessionState;
  dispatch: Function;
}

export class PlayGrammarContainer extends React.Component<PlayGrammarContainerProps, PlayGrammarContainerState> {
    constructor(props: any) {
      super(props);

      this.state = {
        showTurkCode: false,
        saved: false,
        error: false
      }

      this.saveToLMS = this.saveToLMS.bind(this)
      this.finishActivitySession = this.finishActivitySession.bind(this)
      this.createAnonActivitySession = this.createAnonActivitySession.bind(this)
      this.removeSession = this.removeSession.bind(this)
      this.checkAnswer = this.checkAnswer.bind(this)
    }

    componentWillMount() {
      const activityUID = getParameterByName('uid', window.location.href)
      const sessionID = getParameterByName('student', window.location.href)
      const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href)
      if (sessionID) {
        this.props.dispatch(setSessionReducerToSavedSession(sessionID))
      } else {
        this.props.dispatch(setSessionPending(false))
      }

      if (activityUID) {
        this.props.dispatch(getActivity(activityUID))
      }

      if (proofreaderSessionId) {
        this.props.dispatch(startListeningToFollowUpQuestionsForProofreaderSession(proofreaderSessionId))
      }

    }

    componentDidMount() {
      this.props.dispatch(startListeningToConceptsFeedback());
      this.props.dispatch(startListeningToConcepts());
    }

    componentWillReceiveProps(nextProps: PlayGrammarContainerProps) {
      if (nextProps.grammarActivities.hasreceiveddata && !nextProps.session.hasreceiveddata && !nextProps.session.pending && !nextProps.session.error) {
        const { questions, concepts, flag } = nextProps.grammarActivities.currentActivity
        if (questions) {
          this.props.dispatch(getQuestions(questions, flag))
        } else {
          this.props.dispatch(getQuestionsForConcepts(concepts, flag))
        }
      }

      if (nextProps.session.hasreceiveddata && !nextProps.session.currentQuestion && nextProps.session.unansweredQuestions.length === 0 && nextProps.session.answeredQuestions.length > 0) {
        this.saveToLMS(nextProps.session)
        // handles case where proofreader has no follow-up questions
      } else if (nextProps.session.hasreceiveddata && !nextProps.session.currentQuestion && nextProps.session.unansweredQuestions.length === 0 && nextProps.session.proofreaderSession) {
        this.saveToLMS(nextProps.session)
      } else if (nextProps.session.hasreceiveddata && !nextProps.session.currentQuestion) {
        this.props.dispatch(goToNextQuestion())
      }

      const sessionID = getParameterByName('student', window.location.href)
      if (sessionID && !_.isEqual(nextProps.session, this.props.session) && !nextProps.session.pending) {
        updateSessionOnFirebase(sessionID, nextProps.session)
      }

    }

    saveToLMS(questions: SessionState) {
      const { answeredQuestions } = questions
      const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href)
      const score = calculateScoreForLesson(answeredQuestions);
      const activityUID = getParameterByName('uid', window.location.href)
      const sessionID = getParameterByName('student', window.location.href)
      let results
      if (window.location.href.includes('turk')) {
        this.setState({showTurkCode: true})
      }
      if (proofreaderSessionId) {
        const { proofreaderSession } = this.props.session
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
        } else {
          this.finishActivitySession(proofreaderSessionId, proofreaderAndGrammarResults, totalScore)
        }
      } else {
        results = getConceptResultsForAllQuestions(answeredQuestions);
        if (sessionID) {
          this.finishActivitySession(sessionID, results, score);
        } else if (activityUID) {
          this.createAnonActivitySession(activityUID, results, score);
        }
      }
    }

    removeSession() {
      const sessionID = getParameterByName('student', window.location.href)
      const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href)
      if (proofreaderSessionId) {
        removeProofreaderSession(proofreaderSessionId)
      } else if (sessionID) {
        removeGrammarSession(sessionID)
      }
    }

    finishActivitySession(sessionID: string, results: FormattedConceptResult[], score: number) {
      request(
        { url: `${process.env.EMPIRICAL_BASE_URL}/api/v1/activity_sessions/${sessionID}`,
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
            document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${body.activity_session.uid}`;
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

    createAnonActivitySession(lessonID: string, results: FormattedConceptResult[], score: number) {
      request(
        { url: `${process.env.EMPIRICAL_BASE_URL}/api/v1/activity_sessions/`,
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
          if (httpResponse.statusCode === 200) {
            this.removeSession()
            if (!this.state.showTurkCode) {
              document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${body.activity_session.uid}`;
            }
          }
        }
      );
    }

    checkAnswer(response: string, question: Question, responses: Response[], isFirstAttempt: Boolean) {
      this.props.dispatch(checkAnswer(response, question, responses, isFirstAttempt))
    }

    render(): JSX.Element {
      const proofreaderSessionId = getParameterByName('proofreaderSessionId', window.location.href)

      if (this.state.showTurkCode) {
        return <TurkCodePage />
      }
      if ((this.props.grammarActivities.hasreceiveddata || proofreaderSessionId) && this.props.session.hasreceiveddata && this.props.session.currentQuestion) {
        return <QuestionComponent
          activity={this.props.grammarActivities ? this.props.grammarActivities.currentActivity : null}
          answeredQuestions={this.props.session.answeredQuestions}
          checkAnswer={this.checkAnswer}
          concepts={this.props.concepts}
          conceptsFeedback={this.props.conceptsFeedback}
          currentQuestion={this.props.session.currentQuestion}
          goToNextQuestion={() => this.props.dispatch(goToNextQuestion())}
          key={this.props.session.currentQuestion.key}
          unansweredQuestions={this.props.session.unansweredQuestions}
        />
      } else if (this.props.session.error) {
        return (
          <div>{this.props.session.error}</div>
        );
      } else {
        return <LoadingSpinner />
      }
    }
}

const mapStateToProps = (state: any) => {
    return {
        grammarActivities: state.grammarActivities,
        session: state.session,
        conceptsFeedback: state.conceptsFeedback,
        concepts: state.concepts
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayGrammarContainer);
