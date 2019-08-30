import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import * as request from 'request';
import * as _ from 'lodash';
import { stringNormalize } from 'quill-string-normalizer'

const questionIconSrc = `${process.env.QUILL_CDN_URL}/images/icons/question_icon.svg`
const refreshIconSrc = `${process.env.QUILL_CDN_URL}/images/icons/refresh.svg`

import getParameterByName from '../../helpers/getParameterByName';
import { getActivity } from "../../actions/proofreaderActivities";
import { startListeningToConcepts } from "../../actions/concepts";
import {
  updateConceptResultsOnFirebase,
  updateSessionOnFirebase,
  setSessionReducerToSavedSession,
  removeSession
} from "../../actions/session";
// import { getConceptResultsForAllQuestions, calculateScoreForLesson } from '../../helpers/conceptResultsGenerator'
import { SessionState } from '../../reducers/sessionReducer'
import { ProofreaderActivityState } from '../../reducers/proofreaderActivitiesReducer'
import { ConceptResultObject, WordObject } from '../../interfaces/proofreaderActivities'
import PassageReviewer from './passageReviewer'
import EarlySubmitModal from './earlySubmitModal'
import Paragraph from './paragraph'
import ResetModal from './resetModal'
import ReviewModal from './reviewModal'
import LoadingSpinner from '../shared/loading_spinner'

interface PlayProofreaderContainerProps {
  proofreaderActivities: ProofreaderActivityState;
  session: SessionState;
  dispatch: Function;
  admin?: Boolean;
  activityUID?: string;
}

interface PlayProofreaderContainerState {
  passage?: Array<Array<WordObject>>;
  edits: number;
  reviewing: boolean;
  resetting: boolean;
  showEarlySubmitModal: boolean;
  showReviewModal: boolean;
  showResetModal: boolean;
  firebaseSessionID: string|null;
  necessaryEdits?: RegExpMatchArray|null;
  numberOfCorrectChanges?: number;
  originalPassage?: Array<Array<WordObject>>;
  reviewablePassage?: string;
  conceptResultsObjects?: ConceptResultObject[];
}

const FIREBASE_SAVE_INTERVAL = 5000 // 5 seconds

export class PlayProofreaderContainer extends React.Component<PlayProofreaderContainerProps, PlayProofreaderContainerState> {
    private interval: any

    constructor(props: any) {
      super(props);

      this.state = {
        edits: 0,
        reviewing: false,
        showEarlySubmitModal: false,
        showReviewModal: false,
        showResetModal: false,
        resetting: false,
        firebaseSessionID: getParameterByName('student', window.location.href)
      }

      this.saveToLMS = this.saveToLMS.bind(this)
      this.finishActivitySession = this.finishActivitySession.bind(this)
      this.finishReview = this.finishReview.bind(this)
      this.createAnonActivitySession = this.createAnonActivitySession.bind(this)
      this.handleParagraphChange = this.handleParagraphChange.bind(this)
      this.finishActivity = this.finishActivity.bind(this)
      this.renderShowEarlySubmitModal = this.renderShowEarlySubmitModal.bind(this)
      this.closeEarlySubmitModal = this.closeEarlySubmitModal.bind(this)
      this.renderShowReviewModal = this.renderShowReviewModal.bind(this)
      this.closeReviewModal = this.closeReviewModal.bind(this)
      this.checkWork = this.checkWork.bind(this)
      this.calculateScoreForLesson = this.calculateScoreForLesson.bind(this)
      this.openResetModal = this.openResetModal.bind(this)
      this.closeResetModal = this.closeResetModal.bind(this)
      this.reset = this.reset.bind(this)
      this.finishReset = this.finishReset.bind(this)
      this.saveEditedSessionToFirebase = this.saveEditedSessionToFirebase.bind(this)
      this.saveCompletedSessionToFirebase = this.saveCompletedSessionToFirebase.bind(this)
    }

    componentWillMount() {
      const { firebaseSessionID, } = this.state
      const activityUID = getParameterByName('uid', window.location.href) || this.props.activityUID

      this.props.dispatch(startListeningToConcepts())

      if (firebaseSessionID) {
        this.props.dispatch(setSessionReducerToSavedSession(firebaseSessionID))
        this.interval = setInterval(() => {
          this.saveEditedSessionToFirebase(firebaseSessionID)
        }, FIREBASE_SAVE_INTERVAL)
      }

      if (activityUID) {
        this.props.dispatch(getActivity(activityUID))
      }
    }

    componentWillUnmount() {
      if (this.interval) {
        clearInterval(this.interval)
      }
    }

    componentWillReceiveProps(nextProps: PlayProofreaderContainerProps) {
      if (
        (nextProps.proofreaderActivities.currentActivity && !this.state.passage)
        || (!_.isEqual(nextProps.proofreaderActivities.currentActivity, this.props.proofreaderActivities.currentActivity))
      ) {
        const { passage } = nextProps.proofreaderActivities.currentActivity
        const initialPassageData = this.formatInitialPassage(passage)
        const formattedPassage = initialPassageData.passage
        let currentPassage = formattedPassage
        if (
          nextProps.session.passageFromFirebase
          && typeof nextProps.session.passageFromFirebase !== 'string'
        ) {
          currentPassage = nextProps.session.passageFromFirebase
        }
        this.setState({ passage: currentPassage, originalPassage: _.cloneDeep(formattedPassage), necessaryEdits: initialPassageData.necessaryEdits, edits: this.editCount(currentPassage) })
      }
    }

    saveEditedSessionToFirebase(sessionID: string) {
      const { passage } = this.state
      const { passageFromFirebase } = this.props.session
      if (!_.isEqual(passage, passageFromFirebase)) {
        this.props.dispatch(updateSessionOnFirebase(sessionID, passage))
      }
    }

    saveCompletedSessionToFirebase() {
      const { firebaseSessionID, conceptResultsObjects, } = this.state
      const activityUID = getParameterByName('uid', window.location.href)
      const newOrSetFirebaseSessionID = updateConceptResultsOnFirebase(firebaseSessionID, activityUID, conceptResultsObjects)
      this.setState({ firebaseSessionID: newOrSetFirebaseSessionID })
    }

    defaultInstructions() {
      return 'Find and correct the errors in the passage. To edit a word, click on it and re-type it.'
    }

    formatInitialPassage(passage: string) {
      passage = passage.replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
      const necessaryEdits = passage.match(/{\+[^-]+-[^|]+\|[^}]*}/g)
      const necessaryEditRegex = /\+[^-]+-[^|]+\|[^}]*/
      const correctEditRegex = /\+([^-]+)-/m
      const originalTextRegex = /\-([^|]+)\|/m
      const conceptUIDRegex = /\|([^}]+)/m
      const paragraphs = passage.replace('</p><p>', '<br/>').replace(/<p>|<\/p>/g, '').split('<br/>')
      let necessaryEditCounter = 0
      let paragraphIndex = 0
      const passageArray = paragraphs.map((paragraph: string) => {
        if (paragraph.length === 0) {
          return null
        }
        let i = 0
        const paragraphArray = paragraph.split(/{|}/).map((text) => {
          let wordObj, wordArray
          if (necessaryEditRegex.test(text)) {
            wordObj = {
              originalText: text.match(originalTextRegex) ? text.match(originalTextRegex)[1] : '',
              currentText: text.match(originalTextRegex) ? text.match(originalTextRegex)[1] : '',
              necessaryEditIndex: necessaryEditCounter,
              conceptUID: text.match(conceptUIDRegex) ? text.match(conceptUIDRegex)[1] : '',
              correctText: text.match(correctEditRegex) ? text.match(correctEditRegex)[1] : '',
              underlined: true,
              wordIndex: i,
              paragraphIndex
            }
            wordArray = [wordObj]
            necessaryEditCounter++
            i++
          } else {
            wordArray = text.split(/\s+/).map(word => {
              if (word.length === 0) {
                return null
              }
              wordObj = {
                originalText: word,
                currentText: word,
                correctText: word,
                underlined: false,
                wordIndex: i,
                paragraphIndex
              }
              i++
              return wordObj
            })
          }
          return wordArray.filter(Boolean)
        })
        paragraphIndex++
        return _.flatten(paragraphArray)
      })
      return {passage: passageArray.filter(Boolean), necessaryEdits}
    }

    saveToLMS() {
      const { firebaseSessionID } = this.state
      const sessionID = getParameterByName('student', window.location.href)
      const results: ConceptResultObject[]|undefined = this.state.conceptResultsObjects;
      if (results) {
        const score = this.calculateScoreForLesson();
        const activityUID = getParameterByName('uid', window.location.href)
        if (sessionID) {
          this.finishActivitySession(sessionID, results, score);
        } else if (activityUID) {
          this.createAnonActivitySession(activityUID, results, score, firebaseSessionID);
        }
      }
    }

    calculateScoreForLesson() {
      const { numberOfCorrectChanges, necessaryEdits } = this.state
      if (numberOfCorrectChanges && necessaryEdits && necessaryEdits.length) {
        return numberOfCorrectChanges / necessaryEdits.length
      } else {
        return 0
      }
    }

    finishActivitySession(sessionID: string, results: ConceptResultObject[], score: number) {
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
            removeSession(sessionID)
            document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${sessionID}`;
          }
        }
      );
    }

    createAnonActivitySession(lessonID: string, results: ConceptResultObject[], score: number, sessionID: string|null) {
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
            if (sessionID) { removeSession(sessionID) }
            document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${body.activity_session.uid}`;
          }
        }
      );
    }

    checkWork(): { reviewablePassage: string, numberOfCorrectChanges: number, conceptResultsObjects: ConceptResultObject[]} {
      const { currentActivity } = this.props.proofreaderActivities
      const { necessaryEdits, passage } = this.state
      let numberOfCorrectChanges = 0
      const conceptResultsObjects: ConceptResultObject[] = []
      if (passage && necessaryEdits) {
        let reviewablePassage = ''
        passage.forEach((paragraph: Array<any>) => {
          const words:Array<string> = []
          paragraph.forEach((word: any) => {
            const { necessaryEditIndex, correctText, conceptUID, originalText, currentText } = word
            const stringNormalizedCurrentText = stringNormalize(currentText)
            const stringNormalizedCorrectText = stringNormalize(correctText)
            const stringNormalizedOriginalText = stringNormalize(originalText)
            if (necessaryEditIndex || necessaryEditIndex === 0) {
              if (stringNormalizedCorrectText.split('~').includes(stringNormalizedCurrentText)) {
                numberOfCorrectChanges++
                conceptResultsObjects.push({
                  metadata: {
                    answer: stringNormalizedCurrentText,
                    correct: 1,
                    instructions: currentActivity.description || this.defaultInstructions(),
                    prompt: stringNormalizedOriginalText,
                    questionNumber: necessaryEditIndex + 1,
                    unchanged: false,
                  },
                  concept_uid: conceptUID,
                  question_type: "passage-proofreader"
                })
                words.push(`{+${stringNormalizedCurrentText}-|${conceptUID}}`)
              } else {
                conceptResultsObjects.push({
                  metadata: {
                    answer: stringNormalizedCurrentText,
                    correct: 0,
                    instructions: currentActivity.description || this.defaultInstructions(),
                    prompt: stringNormalizedOriginalText,
                    questionNumber: necessaryEditIndex + 1,
                    unchanged: stringNormalizedCurrentText === stringNormalizedOriginalText,
                  },
                  concept_uid: conceptUID,
                  question_type: "passage-proofreader"
                })
                words.push(`{+${correctText}-${stringNormalizedCurrentText}|${conceptUID}}`)
              }
            } else if (stringNormalizedOriginalText !== stringNormalizedCurrentText) {
              words.push(`{+${stringNormalizedOriginalText}-${stringNormalizedCurrentText}|unnecessary}`)
            } else {
              words.push(stringNormalizedCurrentText)
            }
          })
          reviewablePassage = reviewablePassage.concat('<p>').concat(words.join(' ')).concat('</p>')
        })
        return { reviewablePassage, numberOfCorrectChanges, conceptResultsObjects }
      } else {
        return { reviewablePassage: '', numberOfCorrectChanges: 0, conceptResultsObjects: [] }
      }
    }

    finishActivity() {
      const { edits, necessaryEdits } = this.state
      const requiredEditCount = necessaryEdits && necessaryEdits.length ? Math.floor(necessaryEdits.length / 2) : 5
      if (necessaryEdits && necessaryEdits.length && edits === 0 || edits < requiredEditCount) {
        this.setState({showEarlySubmitModal: true})
      } else {
        const { reviewablePassage, numberOfCorrectChanges, conceptResultsObjects } = this.checkWork()
        this.setState( { reviewablePassage, showReviewModal: true, numberOfCorrectChanges, conceptResultsObjects }, this.saveCompletedSessionToFirebase)
      }
    }

    finishReview() {
      const { firebaseSessionID, } = this.state
      const activityUID = getParameterByName('uid', window.location.href)
      const { conceptResultsObjects, necessaryEdits, numberOfCorrectChanges } = this.state
      if (this.props.admin) {
        this.setState({
          passage: _.cloneDeep(this.state.originalPassage),
          edits: 0,
          reviewing: false,
          showEarlySubmitModal: false,
          showReviewModal: false,
          numberOfCorrectChanges: undefined,
          reviewablePassage: undefined,
          conceptResultsObjects: undefined
        })
      } else if (conceptResultsObjects && activityUID) {
        if (necessaryEdits && (necessaryEdits.length === numberOfCorrectChanges)) {
          this.saveToLMS()
        } else if (firebaseSessionID) {
          window.location.href = `${process.env.QUILL_GRAMMAR_URL}/play/sw?proofreaderSessionId=${firebaseSessionID}`
        }
      }
    }

    handleParagraphChange(value: Array<any>, i: number) {
      let newParagraphs = this.state.passage
      if (newParagraphs) {
        newParagraphs[i] = value
        this.setState({ passage: newParagraphs, edits: this.editCount(newParagraphs), })
      }
    }

    editCount(paragraphs: Array<Array<any>>) {
      let editCount = 0
      paragraphs.forEach((p: Array<any>) => {
        const changedWords = p.filter(word => word.currentText !== word.originalText)
        editCount+= changedWords.length
      })
      return editCount
    }

    openResetModal() {
      this.setState({ showResetModal: true })
    }

    closeResetModal() {
      this.setState({ showResetModal: false })
    }

    closeEarlySubmitModal() {
      this.setState({ showEarlySubmitModal: false })
    }

    closeReviewModal() {
      this.setState({ showReviewModal: false, reviewing: true })
    }

    reset() {
      this.setState({
        passage: _.cloneDeep(this.state.originalPassage),
        edits: 0,
        resetting: true,
        showResetModal: false
      })
    }

    finishReset() {
      this.setState({ resetting: false} )
    }

    renderShowEarlySubmitModal(): JSX.Element|void {
      const { showEarlySubmitModal, necessaryEdits } = this.state
      const requiredEditCount = necessaryEdits && necessaryEdits.length ? Math.floor(necessaryEdits.length / 2) : 5
      if (showEarlySubmitModal) {
        return <EarlySubmitModal
          requiredEditCount={requiredEditCount}
          closeModal={this.closeEarlySubmitModal}
        />
      }
    }

    renderShowResetModal(): JSX.Element|void {
      const { showResetModal, } = this.state
      if (showResetModal) {
        return <ResetModal
          reset={this.reset}
          closeModal={this.closeResetModal}
        />
      }
    }

    renderShowReviewModal(): JSX.Element|void {
      const { showReviewModal, necessaryEdits, numberOfCorrectChanges } = this.state
      const numberOfErrors = necessaryEdits && necessaryEdits.length ? necessaryEdits.length : 0
      if (showReviewModal) {
        return <ReviewModal
          numberOfErrors={numberOfErrors}
          numberOfCorrectChanges={numberOfCorrectChanges || 0}
          closeModal={this.closeReviewModal}
        />
      }
    }

    renderPassage(): JSX.Element|void {
      const { reviewing, reviewablePassage, resetting, passage } = this.state
      const { underlineErrorsInProofreader } = this.props.proofreaderActivities.currentActivity
      if (reviewing) {
        const text = reviewablePassage ? reviewablePassage : ''
        return <PassageReviewer
          text={text}
          concepts={this.props.concepts.data[0]}
          finishReview={this.finishReview}
        />
      } else if (passage) {
        const paragraphs = passage.map((p, i) => {
          return <Paragraph
            words={p}
            handleParagraphChange={this.handleParagraphChange}
            resetting={resetting}
            finishReset={this.finishReset}
            underlineErrors={underlineErrorsInProofreader}
            index={i}
            key={i}
          />
        })
        return <div className="editor">{paragraphs}</div>
      }
    }

    renderCheckWorkButton(): JSX.Element|void {
      if (!this.state.reviewing) {
        return <button className="check-work" onClick={this.finishActivity}>Check Work</button>
      }
    }

    renderResetButton(): JSX.Element|void {
      const { reviewing, edits, } = this.state
      if (!reviewing) {
        if (edits) {
          return <button className="reset-button" onClick={this.openResetModal}><img src={refreshIconSrc} /> Reset</button>
        } else {
          return <button className="reset-button disabled"><img src={refreshIconSrc} /> Reset</button>
        }
      }
    }

    render(): JSX.Element {
      const { edits, necessaryEdits} = this.state
      const { currentActivity } = this.props.proofreaderActivities
      const numberOfCorrectEdits = necessaryEdits ? necessaryEdits.length : 0
      if (currentActivity) {
        const className = currentActivity.underlineErrorsInProofreader ? 'underline-errors' : ''
        const necessaryEditsLength = necessaryEdits ? necessaryEdits.length : 1
        const meterWidth = edits / necessaryEditsLength * 100
        return <div className="passage-container">
          <div className="header-section">
            <div className="inner-header">
              <h1>{currentActivity.title}</h1>
              <div className="instructions">
                <div>
                  <img src={questionIconSrc} />
                  <p dangerouslySetInnerHTML={{__html: currentActivity.description || this.defaultInstructions()}}/>
                </div>
                <div className="edits-made">
                  <p>Edits Made: {edits} of {numberOfCorrectEdits}</p>
                  <div className="progress-bar-indication">
                    <span className="meter"
                      style={{width: `${meterWidth}%`}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.renderShowEarlySubmitModal()}
          {this.renderShowResetModal()}
          {this.renderShowReviewModal()}
          <div className={`passage ${className}`}>
            {this.renderPassage()}
          </div>
          <div className="bottom-section">
            {this.renderResetButton()}
            {this.renderCheckWorkButton()}
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
