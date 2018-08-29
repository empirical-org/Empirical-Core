import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import * as request from 'request';
import * as jsdiff from 'diff'
import _ from 'lodash';
import { EditorState, ContentState } from 'draft-js'
const questionIconSrc = 'https://assets.quill.org/images/icons/question_icon.svg'

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
import PassageEditor from './passageEditor'
import PassageReviewer from './passageReviewer'
import EarlySubmitModal from './earlySubmitModal'
import LoadingSpinner from '../shared/loading_spinner'

interface PlayProofreaderContainerProps {
  proofreaderActivities: ProofreaderActivityState;
  session: SessionState;
  dispatch: Function;
}

interface PlayProofreaderContainerState {
  edits: Array<string>;
  reviewing: boolean;
  showEarlySubmitModal: boolean;
  numberOfErrors?: number;
  passage?: string;
  originalPassage?: string;
  reviewablePassage?: string;
}

export class PlayProofreaderContainer extends React.Component<PlayProofreaderContainerProps, PlayProofreaderContainerState> {
    constructor(props: any) {
      super(props);

      this.state = {
        edits: [],
        reviewing: false,
        showEarlySubmitModal: false
      }

      this.saveToLMS = this.saveToLMS.bind(this)
      this.finishActivitySession = this.finishActivitySession.bind(this)
      this.createAnonActivitySession = this.createAnonActivitySession.bind(this)
      this.handlePassageChange = this.handlePassageChange.bind(this)
      this.checkWork = this.checkWork.bind(this)
      this.renderShowEarlySubmitModal = this.renderShowEarlySubmitModal.bind(this)
      this.closeEarlySubmitModal = this.closeEarlySubmitModal.bind(this)
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
    formatInitialPassage(passage: string, underlineErrors: boolean) {
      let numberOfErrors = 0
      passage.replace(/{\+([^-]+)-([^|]+)\|([^}]+)}/g, (key: string, plus: string, minus: string, conceptUID: string) => {
        // if (underlineErrors) {
        //   passage = passage.replace(key, `<u>${minus}</u>`);
        // } else {
          passage = passage.replace(key, minus);
        // }
        numberOfErrors++
      });
      return {passage, numberOfErrors}
    }

    componentWillReceiveProps(nextProps: PlayProofreaderContainerProps) {
      if (nextProps.proofreaderActivities.hasreceiveddata) {
        const { passage, underlineErrorsInProofreader } = nextProps.proofreaderActivities.currentActivity
        const initialPassageData = this.formatInitialPassage(passage, underlineErrorsInProofreader)
        const formattedPassage = initialPassageData.passage
        // let uneditedPassage = passage
        // passage.replace(/{\+([^-]+)-([^|]+)\|([^}]+)}/g, (key, plus, minus, conceptUID) => {
        //   uneditedPassage = passage.replace(key, minus);
        // });
        this.setState({passage: formattedPassage, originalPassage: formattedPassage, numberOfErrors: initialPassageData.numberOfErrors})

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
      const regex = /<strong>.*?<\/strong>/gm
      const edits = value.match(regex)
      if (edits && !_.isEqual(edits, this.state.edits)) {
        this.setState({ passage: value, edits })
      }
    }

    checkWork() {
      const { edits, numberOfErrors } = this.state
      const requiredEditCount = numberOfErrors ? Math.floor(numberOfErrors/2) : 5
      if (numberOfErrors && edits.length === 0 || edits.length < requiredEditCount) {
        this.setState({showEarlySubmitModal: true})
      } else {
        const editedPassage = this.state.passage
        // const { edits } = this.state
        const { passage } = this.props.proofreaderActivities.currentActivity
        const correctEdits = passage.match(/{\+([^-]+)-([^|]+)\|([^}]+)}/g) || []
        if (editedPassage) {
          const reviewablePassage = editedPassage.replace(/<strong>(.*?)<\/strong>/gm , (key, edit) => {
            console.log('edit', edit)
            const match = correctEdits.find(correctEdit => {
              const attemptedMatch = correctEdit.match(/([^-]+)-/g)
              const correctText = attemptedMatch && attemptedMatch[0] ? attemptedMatch[0].replace(/{|\+|\-/g, '') : null
              console.log('correctText', correctText)
              if (edit === correctText) {
                return correctEdit
              }
            })
            console.log('match', match)
            if (match) {
              return match
            } else {
              return `{+${edit}|unnecessary}`
            }
          })
          this.setState({ reviewablePassage, reviewing: true })
        }
      }
    }

    renderShowEarlySubmitModal() {
      const { showEarlySubmitModal, numberOfErrors } = this.state
      const requiredEditCount = numberOfErrors ? Math.floor(numberOfErrors/2) : 5
      if (showEarlySubmitModal) {
        return <EarlySubmitModal
          requiredEditCount={requiredEditCount}
          closeModal={this.closeEarlySubmitModal}
        />
      }
    }

    closeEarlySubmitModal() {
      this.setState({ showEarlySubmitModal: false })
    }

    render(): JSX.Element {
      const { currentActivity } = this.props.proofreaderActivities
      if (this.props.proofreaderActivities.hasreceiveddata) {
        const className = currentActivity.underlineErrorsInProofreader ? 'underline-errors' : ''
        return <div className="passage-container">
          <div className="header-section">
            <div className="inner-header">
              <h1>{currentActivity.title}</h1>
              <div className="instructions">
                <div>
                  <img src={questionIconSrc} />
                  <p>{currentActivity.description}</p>
                </div>
                <div className="edits-made">
                  <p>Edits Made: {this.state.edits.length} of {this.state.numberOfErrors}</p>
                  <div className="progress-bar-indication" />
                </div>
              </div>
            </div>
          </div>
          {this.renderShowEarlySubmitModal()}
          <div className={`passage ${className}`}>
            <PassageEditor
              text={this.state.originalPassage}
              handleTextChange={this.handlePassageChange}
            />
          </div>
          <div className="bottom-section">
            <button onClick={this.checkWork}>Check Work</button>
          </div>
        </div>
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
