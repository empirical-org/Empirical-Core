import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import * as request from 'request';
import _ from 'lodash';
const questionIconSrc = 'https://assets.quill.org/images/icons/question_icon.svg'

import getParameterByName from '../../helpers/getParameterByName';
import { startListeningToActivity } from "../../actions/proofreaderActivities";
import { startListeningToConcepts } from "../../actions/concepts";
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
import ReviewModal from './reviewModal'
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
  showReviewModal: boolean;
  correctEdits?: Array<String>;
  numberOfCorrectChanges?: number;
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
      this.renderShowReviewModal = this.renderShowReviewModal.bind(this)
      this.closeReviewModal = this.closeReviewModal.bind(this)
    }

    componentWillMount() {
      const activityUID = getParameterByName('uid', window.location.href)
      const sessionID = getParameterByName('student', window.location.href)

      this.props.dispatch(startListeningToConcepts())

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
      let correctEdits = []
      passage.replace(/{\+([^-]+)-([^|]+)\|([^}]+)}/g, (key: string, plus: string, minus: string, conceptUID: string) => {
        // if (underlineErrors) {
          // passage = passage.replace(key, `<span id="${key}">${minus}</span>`);
        // } else {
          passage = passage.replace(key, `<u id="${correctEdits.length}">${minus}</u>`);
        // }
        correctEdits.push(key)
      });
      return {passage, correctEdits}
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
        this.setState({passage: formattedPassage, originalPassage: formattedPassage, correctEdits: initialPassageData.correctEdits})

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

    formatReceivedPassage(value: string) {
      const stringWithoutUnnecessaryHtml = value.replace(/<span>|<\/span>|<strong> <\/strong>/gm, '')
      return stringWithoutUnnecessaryHtml
    }

    handlePassageChange(value: string) {
      const formattedValue = this.formatReceivedPassage(value)
      const regex = /<strong>.*?<\/strong>/gm
      const edits = formattedValue.match(regex)
      console.log('edits', edits)
      if (edits && !_.isEqual(edits, this.state.edits)) {
        this.setState({ passage: value, edits })
      }
    }

    checkWork() {
      const { edits, correctEdits } = this.state
      const requiredEditCount = correctEdits && correctEdits.length ? Math.floor(correctEdits.length/2) : 5
      if (correctEdits && correctEdits.length && edits.length === 0 || edits.length < requiredEditCount) {
        this.setState({showEarlySubmitModal: true})
      } else {
        const editedPassage = this.state.passage
        // const { edits } = this.state
        const { passage } = this.props.proofreaderActivities.currentActivity
        let numberOfCorrectChanges = 0
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
              numberOfCorrectChanges++
              return match
            } else {
              return `{+${edit}-|unnecessary}`
            }
          })
          this.setState({ reviewablePassage, showReviewModal: true, numberOfCorrectChanges: numberOfCorrectChanges})
        }
      }
    }

    renderShowEarlySubmitModal() {
      const { showEarlySubmitModal, correctEdits } = this.state
      const requiredEditCount = correctEdits && correctEdits.length ? Math.floor(correctEdits.length/2) : 5
      if (showEarlySubmitModal) {
        return <EarlySubmitModal
          requiredEditCount={requiredEditCount}
          closeModal={this.closeEarlySubmitModal}
        />
      }
    }

    renderShowReviewModal() {
      const { showReviewModal, correctEdits, numberOfCorrectChanges } = this.state
      const numberOfErrors = correctEdits && correctEdits.length ? correctEdits.length : 0
      if (showReviewModal) {
        return <ReviewModal
          numberOfErrors={numberOfErrors}
          numberOfCorrectChanges={numberOfCorrectChanges || 0}
          closeModal={this.closeReviewModal}
        />
      }
    }

    renderPassage() {
      const { reviewing, reviewablePassage, originalPassage } = this.state
      if (reviewing) {
        const text = reviewablePassage ? reviewablePassage : ''
        return <PassageReviewer
          text={text}
          concepts={this.props.concepts.data[0]}
        />
      } else if (originalPassage) {
        return <PassageEditor
          text={originalPassage}
          handleTextChange={this.handlePassageChange}
        />
      }
    }

    closeEarlySubmitModal() {
      this.setState({ showEarlySubmitModal: false })
    }

    closeReviewModal() {
      this.setState({ showReviewModal: false, reviewing: true })
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
                  <p>Edits Made: {this.state.edits.length} of {this.state.correctEdits.length}</p>
                  <div className="progress-bar-indication" />
                </div>
              </div>
            </div>
          </div>
          {this.renderShowEarlySubmitModal()}
          {this.renderShowReviewModal()}
          <div className={`passage ${className}`}>
            {this.renderPassage()}
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
        session: state.session,
        concepts: state.concepts
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayProofreaderContainer);
