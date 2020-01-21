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
  removeSession,
  setPassage
} from "../../actions/session";

import { SessionState } from '../../reducers/sessionReducer'
import { ProofreaderActivityState } from '../../reducers/proofreaderActivitiesReducer'
import { ConceptResultObject, WordObject } from '../../interfaces/proofreaderActivities'
import PassageReviewer from './passageReviewer'
import EarlySubmitModal from './earlySubmitModal'
import Paragraph from './paragraph'
import ResetModal from './resetModal'
import ReviewModal from './reviewModal'
import ProgressBar from './progressBar'
import LoadingSpinner from '../shared/loading_spinner'

interface PlayProofreaderContainerProps {
  proofreaderActivities: ProofreaderActivityState;
  session: SessionState;
  dispatch: Function;
  admin?: Boolean;
  activityUID?: string;
}

interface PlayProofreaderContainerState {
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

const FIREBASE_SAVE_INTERVAL = 30000 // 30 seconds

export class PlayProofreaderContainer extends React.Component<PlayProofreaderContainerProps, PlayProofreaderContainerState> {
    private interval: any // eslint-disable-line react/sort-comp

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
    }

    componentWillMount() {
      const { activityUID, dispatch, } = this.props
      const { firebaseSessionID, } = this.state
      const activityUID = getParameterByName('uid', window.location.href) || activityUID

      dispatch(startListeningToConcepts())

      if (firebaseSessionID) {
        dispatch(setSessionReducerToSavedSession(firebaseSessionID))
        this.interval = setInterval(() => {
          this.saveEditedSessionToFirebase(firebaseSessionID)
        }, FIREBASE_SAVE_INTERVAL)
      }

      if (activityUID) {
        dispatch(getActivity(activityUID))
      }
    }

    componentWillUnmount() {
      if (this.interval) {
        clearInterval(this.interval)
      }
    }

    componentWillReceiveProps(nextProps: PlayProofreaderContainerProps) {
      const { proofreaderActivities, dispatch, } = this.props
      if (
        (nextProps.proofreaderActivities.currentActivity && !nextProps.session.passage)
        || (!_.isEqual(nextProps.proofreaderActivities.currentActivity, proofreaderActivities.currentActivity))
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
        this.setState({ originalPassage: _.cloneDeep(formattedPassage), necessaryEdits: initialPassageData.necessaryEdits, edits: this.editCount(currentPassage) })
        dispatch(setPassage(currentPassage))
      }
    }

    saveEditedSessionToFirebase = (sessionID: string) => {
      const { dispatch, session, } = this.props
      const { passageFromFirebase, passage, } = session
      if (!_.isEqual(passage, passageFromFirebase)) {
        dispatch(updateSessionOnFirebase(sessionID, passage))
      }
    }

    saveCompletedSessionToFirebase = () => {
      const { firebaseSessionID, conceptResultsObjects, } = this.state
      const activityUID = getParameterByName('uid', window.location.href)
      const newOrSetFirebaseSessionID = updateConceptResultsOnFirebase(firebaseSessionID, activityUID, conceptResultsObjects)
      this.setState({ firebaseSessionID: newOrSetFirebaseSessionID })
    }

    defaultInstructions = () => {
      return 'Find and correct the errors in the passage. To edit a word, click on it and re-type it.'
    }

    formatInitialPassage = (passage: string) => {
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
            necessaryEditCounter+=1
            i+=1
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
              i+=1
              return wordObj
            })
          }
          return wordArray.filter(Boolean)
        })
        paragraphIndex+=1
        return _.flatten(paragraphArray)
      })
      return {passage: passageArray.filter(Boolean), necessaryEdits}
    }

    saveToLMS = () => {
      const { firebaseSessionID, conceptResultsObjects, } = this.state
      const sessionID = getParameterByName('student', window.location.href)
      const results: ConceptResultObject[]|undefined = conceptResultsObjects;
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

    calculateScoreForLesson = () => {
      const { numberOfCorrectChanges, necessaryEdits } = this.state
      if (numberOfCorrectChanges && necessaryEdits && necessaryEdits.length) {
        return numberOfCorrectChanges / necessaryEdits.length
      } else {
        return 0
      }
    }

    handleCheckWorkClickSession = (sessionID: string, results: ConceptResultObject[], score: number) => {
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

    createAnonActivitySession = (lessonID: string, results: ConceptResultObject[], score: number, sessionID: string|null) => {
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
          if (httpResponse && httpResponse.statusCode === 200) {
            if (sessionID) { removeSession(sessionID) }
            document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${body.activity_session.uid}`;
          }
        }
      );
    }

    checkWork = (): { reviewablePassage: string, numberOfCorrectChanges: number, conceptResultsObjects: ConceptResultObject[]} => {
      const { session, proofreaderActivities, } = this.props
      const { passage} = session
      const { currentActivity } = proofreaderActivities
      const { necessaryEdits, } = this.state
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
                numberOfCorrectChanges+=1
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

    handleCheckWorkClick = () => {
      const { edits, necessaryEdits } = this.state
      const requiredEditCount = necessaryEdits && necessaryEdits.length ? Math.floor(necessaryEdits.length / 2) : 5
      if (necessaryEdits && necessaryEdits.length && edits === 0 || edits < requiredEditCount) {
        this.setState({showEarlySubmitModal: true})
      } else {
        const { reviewablePassage, numberOfCorrectChanges, conceptResultsObjects } = this.checkWork()
        this.setState( { reviewablePassage, showReviewModal: true, numberOfCorrectChanges, conceptResultsObjects }, this.saveCompletedSessionToFirebase)
      }
    }

    finishReview = () => {
      const { firebaseSessionID, originalPassage, conceptResultsObjects, necessaryEdits, numberOfCorrectChanges, } = this.state
      const { admin, dispatch, } = this.props
      const activityUID = getParameterByName('uid', window.location.href)
      const newPassage = _.cloneDeep(originalPassage)
      if (admin) {
        this.setState({
          edits: 0,
          reviewing: false,
          showEarlySubmitModal: false,
          showReviewModal: false,
          numberOfCorrectChanges: undefined,
          reviewablePassage: undefined,
          conceptResultsObjects: undefined
        })
        dispatch(setPassage(newPassage))
      } else if (conceptResultsObjects && activityUID) {
        if (necessaryEdits && (necessaryEdits.length === numberOfCorrectChanges)) {
          this.saveToLMS()
        } else if (firebaseSessionID) {
          window.location.href = `${process.env.QUILL_GRAMMAR_URL}/play/sw?proofreaderSessionId=${firebaseSessionID}`
        }
      }
    }

    onParagraphChange = (value: Array<any>, i: number) => {
      const { session, dispatch, } = this.props
      let newParagraphs = session.passage
      if (newParagraphs) {
        newParagraphs[i] = value
        dispatch(setPassage(newParagraphs))
        this.setState({ edits: this.editCount(newParagraphs), })
      }
    }

    editCount = (paragraphs: Array<Array<any>>) => {
      let editCount = 0
      paragraphs.forEach((p: Array<any>) => {
        const changedWords = p.filter(word => word.currentText !== word.originalText)
        editCount+= changedWords.length
      })
      return editCount
    }

    handleResetClick = () => {
      this.setState({ showResetModal: true })
    }

    closeResetModal = () => {
      this.setState({ showResetModal: false })
    }

    closeEarlySubmitModal = () => {
      this.setState({ showEarlySubmitModal: false })
    }

    closeReviewModal = () => {
      this.setState({ showReviewModal: false, reviewing: true })
    }

    reset = () => {
      const { dispatch, } = this.props
      const { originalPassage, } = this.state
      const newPassage = _.cloneDeep(originalPassage)
      dispatch(setPassage(newPassage))
      this.setState({
        edits: 0,
        resetting: true,
        showResetModal: false
      })
    }

    finishReset = () => {
      this.setState({ resetting: false} )
    }

    renderShowEarlySubmitModal = (): JSX.Element|void => {
      const { showEarlySubmitModal, necessaryEdits } = this.state
      const requiredEditCount = necessaryEdits && necessaryEdits.length ? Math.floor(necessaryEdits.length / 2) : 5
      if (showEarlySubmitModal) {
        return (<EarlySubmitModal
          closeModal={this.closeEarlySubmitModal}
          requiredEditCount={requiredEditCount}
        />)
      }
    }

    renderShowResetModal = (): JSX.Element|void => {
      const { showResetModal, } = this.state
      if (showResetModal) {
        return (<ResetModal
          closeModal={this.closeResetModal}
          reset={this.reset}
        />)
      }
    }

    renderShowReviewModal = (): JSX.Element|void => {
      const { showReviewModal, necessaryEdits, numberOfCorrectChanges } = this.state
      const numberOfErrors = necessaryEdits && necessaryEdits.length ? necessaryEdits.length : 0
      if (showReviewModal) {
        return (<ReviewModal
          closeModal={this.closeReviewModal}
          numberOfCorrectChanges={numberOfCorrectChanges || 0}
          numberOfErrors={numberOfErrors}
        />)
      }
    }

    renderPassage = (): JSX.Element|void => {
      const { session, proofreaderActivities, concepts, } = this.props
      const { passage } = session
      const { reviewing, reviewablePassage, resetting } = this.state
      const { underlineErrorsInProofreader } = proofreaderActivities.currentActivity
      if (reviewing) {
        const text = reviewablePassage ? reviewablePassage : ''
        return (<PassageReviewer
          concepts={concepts.data[0]}
          finishReview={this.finishReview}
          text={text}
        />)
      } else if (passage) {
        const paragraphs = passage.map((p, i) => {
          return (<Paragraph
            finishReset={this.finishReset}
            handleParagraphChange={this.onParagraphChange}
            index={i}
            key={i}
            resetting={resetting}
            underlineErrors={underlineErrorsInProofreader}
            words={p}
          />)
        })
        return <div className="editor">{paragraphs}</div>
      }
    }

    renderCheckWorkButton = (): JSX.Element|void => {
      const { reviewing, } = this.state
      if (!reviewing) {
        return <button className="check-work" onClick={this.handleCheckWorkClick} type="button">Check Work</button>
      }
    }

    renderResetButton = (): JSX.Element|void => {
      const { reviewing, edits, } = this.state
      if (!reviewing) {
        if (edits) {
          return <button className="reset-button" onClick={this.handleResetClick} type="button"><img src={refreshIconSrc} /> Reset</button>
        } else {
          return <button className="reset-button disabled" type="button"><img src={refreshIconSrc} /> Reset</button>
        }
      }
    }

    render(): JSX.Element {
      const { proofreaderActivities, session, } = this.props
      const { edits, necessaryEdits} = this.state
      const { currentActivity } = proofreaderActivities
      if (currentActivity) {
        const className = currentActivity.underlineErrorsInProofreader ? 'underline-errors' : ''
        const necessaryEditsLength = necessaryEdits ? necessaryEdits.length : 1
        const meterWidth = edits / necessaryEditsLength * 100
        return (<div className="passage-container">
          <ProgressBar answeredQuestionCount={edits} percent={meterWidth} questionCount={necessaryEditsLength} />
          <div className="header-section">
            <div className="inner-header">
              <h1>{currentActivity.title}</h1>
              <div className="instructions">
                <div>
                  <img src={questionIconSrc} />
                  <p dangerouslySetInnerHTML={{__html: currentActivity.description || this.defaultInstructions()}} />
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
        </div>)
      } else if (session.error) {
        return (
          <div>{session.error}</div>
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
