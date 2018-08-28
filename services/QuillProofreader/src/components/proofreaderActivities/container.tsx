import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import * as request from 'request';
import * as jsdiff from 'diff'
import _ from 'lodash';
import { EditorState, ContentState } from 'draft-js'

import getParameterByName from '../../helpers/getParameterByName';
import { startListeningToActivity } from "../../actions/proofreaderActivities";
import {
  updateSessionOnFirebase,
  startListeningToQuestions,
  goToNextQuestion,
  checkAnswer,
  setSessionReducerToSavedSession
} from "../../actions/session";
import { getConceptResultsForAllQuestions, calculateScoreForLesson } from '../../helpers/conceptResultsGenerator'
import { SessionState } from '../../reducers/sessionReducer'
import { ProofreaderActivityState } from '../../reducers/proofreaderActivitiesReducer'
import { Question, FormattedConceptResult } from '../../interfaces/questions'
import TextEditor from '../shared/textEditor'
import LoadingSpinner from '../shared/loading_spinner'


interface PlayProofreaderContainerProps {
  proofreaderActivities: ProofreaderActivityState;
  session: SessionState;
  dispatch: Function;
}

export class PlayProofreaderContainer extends React.Component<PlayProofreaderContainerProps, any> {
    constructor(props: any) {
      super(props);

      this.saveToLMS = this.saveToLMS.bind(this)
      this.finishActivitySession = this.finishActivitySession.bind(this)
      this.createAnonActivitySession = this.createAnonActivitySession.bind(this)
      this.handlePassageChange = this.handlePassageChange.bind(this)
    }

    componentWillMount() {
      const activityUID = getParameterByName('uid', window.location.href)
      const sessionID = getParameterByName('student', window.location.href)

      if (sessionID) {
        this.props.dispatch(setSessionReducerToSavedSession(sessionID))
      }

      if (activityUID) {
        this.props.dispatch(startListeningToActivity(activityUID))
      }

    }

    // extractEditsFromPassage(passage: string) {
    //   const edits = {};
    //
    //   passage.replace(/{\+([^-]+)-([^|]+)\|([^}]+)}/g, (key, plus, minus, conceptUID) => {
    //     const genKey = Math.random();
    //     edits[genKey] = {
    //       plus: plus,
    //       minus: minus,
    //       conceptUID: conceptUID
    //     };
    //     passage = passage.replace(key, genKey);
    //   });
    //   passage.replace(/{-([^|]+)\+([^-]+)\|([^}]+)}/g, (key, minus, plus, conceptUID) => {
    //     const genKey = Math.random();
    //     edits[genKey] = {
    //       plus: plus,
    //       minus: minus,
    //       conceptUID: conceptUID
    //     };
    //     passage = passage.replace(key, genKey);
    //   });
    //   return [edits, passage];
    // }
    //
    formatInitialPassage(passage: string) {
      passage.replace(/{\+([^-]+)-([^|]+)\|([^}]+)}/g, (key: string, plus: string, minus: string, conceptUID: string) => {
        passage = passage.replace(key, minus);
      });
      return passage

    }

    componentWillReceiveProps(nextProps: PlayProofreaderContainerProps) {
      if (nextProps.proofreaderActivities.hasreceiveddata) {
        const { passage } = nextProps.proofreaderActivities.currentActivity
        const formattedPassage = this.formatInitialPassage(passage)
        // let uneditedPassage = passage
        // passage.replace(/{\+([^-]+)-([^|]+)\|([^}]+)}/g, (key, plus, minus, conceptUID) => {
        //   uneditedPassage = passage.replace(key, minus);
        // });
        this.setState({passage: formattedPassage, originalPassage: formattedPassage})

        // const passageWithEdits = this.extractEditsFromPassage(nextProps.proofreaderActivities.currentActivity.passage)
      }
      // if (nextProps.proofreaderActivities.hasreceiveddata && !nextProps.session.hasreceiveddata && !nextProps.session.error) {
      //   const concepts = nextProps.proofreaderActivities.currentActivity.concepts
      //   this.props.dispatch(startListeningToQuestions(concepts))
      // }
      //
      // if (nextProps.session.hasreceiveddata && !nextProps.session.currentQuestion && nextProps.session.unansweredQuestions.length === 0 && nextProps.session.answeredQuestions.length > 0) {
      //   this.saveToLMS(nextProps.session)
      // } else if (nextProps.session.hasreceiveddata && !nextProps.session.currentQuestion) {
      //   this.props.dispatch(goToNextQuestion())
      // }
      //
      const sessionID = getParameterByName('student', window.location.href)
      if (sessionID && !_.isEqual(nextProps.session, this.props.session)) {
        updateSessionOnFirebase(sessionID, nextProps.session)
      }

    }

    saveToLMS(questions: SessionState) {
      const results = getConceptResultsForAllQuestions(questions.answeredQuestions);
      const score = calculateScoreForLesson(questions.answeredQuestions);
      const activityUID = getParameterByName('uid', window.location.href)
      const sessionID = getParameterByName('student', window.location.href)
      if (sessionID) {
        this.finishActivitySession(sessionID, results, score);
      } else if (activityUID) {
        this.createAnonActivitySession(activityUID, results, score);
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
            const sessionID = getParameterByName('student', window.location.href)
            document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${sessionID}`;
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
            document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${body.activity_session.uid}`;
            this.setState({ saved: true, });
          }
        }
      );
    }

    handlePassageChange(value: string) {
      // const strippedOriginal = this.standardizedPassage(this.state.originalPassage)
      // const strippedNew = this.standardizedPassage(value)
      // const diff = jsdiff.diffWords(strippedOriginal, strippedNew)
      // const relevantDiff = diff.filter(d => d.added || d.removed)
      // if (relevantDiff.length) {
      //   let valueWithHighlightedChanges = ''
      //   diff.forEach(diff => {
      //     if (diff.added) {
      //       valueWithHighlightedChanges += ` <b>${diff.value}</b> `
      //     } else if (!diff.removed) {
      //       valueWithHighlightedChanges += diff.value
      //     }
      //   })
      //   console.log('valueWithHighlightedChanges', valueWithHighlightedChanges)
        this.setState({ passage: value})
      // }
    }

    standardizedPassage(string: string) {
      return string.replace(/<(?:.|\n)*?>/gm, '').replace(/&#x27;/gm, "'")
    }

    render(): JSX.Element {
      if (this.props.proofreaderActivities.hasreceiveddata) {
        return <div>
          <p>{this.props.proofreaderActivities.currentActivity.title}</p>
          <TextEditor
            text={this.state.originalPassage}
            handleTextChange={this.handlePassageChange}
          />

        </div>
        // return <QuestionComponent
        //   activity={this.props.proofreaderActivities.currentActivity}
        //   answeredQuestions={this.props.session.answeredQuestions}
        //   unansweredQuestions={this.props.session.unansweredQuestions}
        //   currentQuestion={this.props.session.currentQuestion}
        //   goToNextQuestion={() => this.props.dispatch(goToNextQuestion())}
        //   checkAnswer={(response: string, question: Question) => this.props.dispatch(checkAnswer(response, question))}
        // />
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
        proofreaderActivities: state.proofreaderActivities,
        session: state.session
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayProofreaderContainer);
