import * as _ from 'lodash';
import { stringNormalize } from 'quill-string-normalizer';
import * as React from "react";
import { connect } from "react-redux";
import * as Redux from "redux";
import { sentences } from 'sbd';

const directionSrc = `${process.env.CDN_URL}/images/icons/direction.svg`

import EarlySubmitModal from './earlySubmitModal';
import FollowupModal from './followupModal';
import formatInitialPassage from './formatInitialPassage';
import Paragraph from './paragraph';
import PassageReviewer from './passageReviewer';
import ProgressBar from './progressBar';
import ResetModal from './resetModal';
import ReviewModal from './reviewModal';
import { isAnEditRegex, negativeMatchRegex, startsWithPunctuationRegex } from './sharedRegexes';
import WelcomePage from './welcomePage';

import { requestPost, requestPut } from '../../../../modules/request/index';
import { startListeningToConcepts } from "../../actions/concepts";
import { getActivity } from "../../actions/proofreaderActivities";
import {
  setPassage, setSessionReducerToSavedSession, updateConceptResultsOnFirebase,
  updateSessionOnFirebase, updateTimeTracking
} from "../../actions/session";
import determineUnnecessaryEditType, { unnecessarySpaceSplitResponse, UNNECESSARY_SPACE } from '../../helpers/determineUnnecessaryEditType';
import EditCaretPositioning from '../../helpers/EditCaretPositioning';
import getParameterByName from '../../helpers/getParameterByName';
import { ConceptResultObject, WordObject } from '../../interfaces/proofreaderActivities';
import { ProofreaderActivityState } from '../../reducers/proofreaderActivitiesReducer';
import { SessionState } from '../../reducers/sessionReducer';
import LoadingSpinner from '../shared/loading_spinner';

import {
  CLICK, KEYDOWN, KEYPRESS, MOUSEDOWN, MOUSEMOVE, roundValuesToSeconds, SCROLL, VISIBILITYCHANGE
} from '../../../Shared/index';

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
  numberOfResets: number;
  showEarlySubmitModal: boolean;
  showReviewModal: boolean;
  showResetModal: boolean;
  showFollowupModal: boolean;
  showWelcomePage: boolean;
  firebaseSessionID: string|null;
  loadingFirebaseSession: boolean;
  currentActivity: any;
  necessaryEdits?: RegExpMatchArray|null;
  numberOfCorrectChanges?: number;
  originalPassage?: Array<Array<WordObject>>;
  reviewablePassage?: string;
  conceptResultsObjects?: ConceptResultObject[];
  startTime: number;
  isIdle: boolean;
}

const FIREBASE_SAVE_INTERVAL = 30000 // 30 seconds

const editCount = (paragraphs: Array<Array<any>>) => {
  let editCount = 0
  paragraphs.forEach((p: Array<any>) => {
    const changedWords = p.filter(word => word.currentText !== word.originalText)
    editCount+= changedWords.length
  })
  return editCount
}

const findSentence = (paragraphSentences: string[], wordIndex: number, word: string) => {
  let indexOfLastWordInSentence = 0
  for (const paragraphSentence of paragraphSentences) {
    indexOfLastWordInSentence += paragraphSentence.length
    if (wordIndex <= indexOfLastWordInSentence && paragraphSentence.includes(word)) {
      const paragraphSentenceWithBoldedWord = paragraphSentence.replace(word, `<strong>${word}</strong>`)
      return paragraphSentenceWithBoldedWord
    }
  }
  return ''
}

const joinParagraph = (paragraph: Array<any>) => {
  const normalizedWords = paragraph.map(w => stringNormalize(w.originalText))
  return joinWords(normalizedWords)
}

const joinWords = (wordArray: string[]) => {
  let paragraphString = ''
  wordArray.forEach((word: string, i: number) => {
    paragraphString += word

    const nextWord = wordArray[i + 1]
    if (!nextWord) { return }

    const nextWordIsAnEdit = nextWord.match(isAnEditRegex)

    if (nextWordIsAnEdit) {
      const negativeMatch = nextWord.match(negativeMatchRegex)
      if (negativeMatch && negativeMatch[1].match(startsWithPunctuationRegex)) { return }
    } else if (nextWord.match(startsWithPunctuationRegex)) {
      return
    }

    paragraphString += ' '
  })
  return paragraphString
}

export class PlayProofreaderContainer extends React.Component<PlayProofreaderContainerProps, PlayProofreaderContainerState> {
  static getDerivedStateFromProps(nextProps: PlayProofreaderContainerProps, prevState: PlayProofreaderContainerState) {
    const { proofreaderActivities, session, dispatch, } = nextProps
    const theCurrentActivityHasNotChanged = _.isEqual(proofreaderActivities.currentActivity, prevState.currentActivity)
    if ((session.passage && theCurrentActivityHasNotChanged && prevState.necessaryEdits) || !proofreaderActivities.currentActivity) { return null }

    const { passage } = proofreaderActivities.currentActivity
    const initialPassageData = formatInitialPassage(passage)
    const formattedPassage = initialPassageData.passage
    let currentPassage = formattedPassage
    if (session.passageFromFirebase && typeof session.passageFromFirebase !== 'string' && session.passageFromFirebase.length) {
      currentPassage = session.passageFromFirebase
    }
    dispatch(setPassage(currentPassage))
    return { originalPassage: _.cloneDeep(formattedPassage), necessaryEdits: initialPassageData.necessaryEdits, edits: editCount(currentPassage), currentActivity: proofreaderActivities.currentActivity, loadingFirebaseSession: false }
  }

    private interval: any // eslint-disable-line react/sort-comp

    constructor(props: any) {
      super(props);

      this.passageContainer = null

      const { proofreaderActivities, admin, } = props

      const { currentActivity, } = proofreaderActivities

      const firebaseSessionID = getParameterByName('student', window.location.href)

      if (firebaseSessionID) {
        props.dispatch(setSessionReducerToSavedSession(firebaseSessionID, true))
        this.interval = setInterval(() => {
          this.saveEditedSessionToFirebase(firebaseSessionID)
        }, FIREBASE_SAVE_INTERVAL)
      }

      this.state = {
        edits: 0,
        reviewing: false,
        showEarlySubmitModal: false,
        showReviewModal: false,
        showResetModal: false,
        showFollowupModal: false,
        showWelcomePage: !admin,
        numberOfResets: 0,
        loadingFirebaseSession: !!firebaseSessionID,
        firebaseSessionID,
        currentActivity,
        startTime: Date.now(),
        isIdle: false,
      }
    }

    componentDidMount() {
      const { activityUID, dispatch, } = this.props
      const activityUIDToUse = getParameterByName('uid', window.location.href) || activityUID

      dispatch(startListeningToConcepts())

      if (activityUIDToUse) {
        dispatch(getActivity(activityUIDToUse))
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
      const { proofreaderActivities } = this.props
      const { currentActivity, hasreceiveddata } = proofreaderActivities

      if (prevProps.proofreaderActivities.hasreceiveddata != hasreceiveddata && hasreceiveddata) {
        document.title = `Quill.org | ${currentActivity.title}`
      }
    }

    componentWillUnmount() {
      if (this.interval) {
        clearInterval(this.interval)
      }

      window.removeEventListener(KEYDOWN, this.resetTimers)
      window.removeEventListener(MOUSEMOVE, this.resetTimers)
      window.removeEventListener(MOUSEDOWN, this.resetTimers)
      window.removeEventListener(CLICK, this.resetTimers)
      window.removeEventListener(KEYPRESS, this.resetTimers)
      window.removeEventListener(SCROLL, this.resetTimers)
      window.removeEventListener(VISIBILITYCHANGE, this.setIdle)
    }

    resetTimers = (e=null) => {
      const { session, dispatch, } = this.props

      if (!session) { return }

      const now = Date.now()
      this.setState((prevState, props) => {
        const { timeTracking, } = props.session

        const { startTime, isIdle, inactivityTimer, } = prevState

        if (inactivityTimer) { clearTimeout(inactivityTimer) }

        let elapsedTime = now - startTime

        if (isIdle) {
          elapsedTime = 0
        }
        dispatch(updateTimeTracking({...timeTracking, 'proofreading_the_passage': (timeTracking && timeTracking['proofreading_the_passage'] || 0) + elapsedTime}))
        const newInactivityTimer = setTimeout(this.setIdle, 30000);  // time is in milliseconds (1000 is 1 second)

        return { isIdle: false, inactivityTimer: newInactivityTimer, startTime: now, }
      })

      return Promise.resolve(true);
    }

    setIdle = () => { this.resetTimers().then(() => this.setState({ isIdle: true })) }

    saveEditedSessionToFirebase = (sessionID: string) => {
      const { dispatch, session, } = this.props
      const { passageFromFirebase, passage, timeTracking, } = session
      if (!_.isEqual(passage, passageFromFirebase)) {
        dispatch(updateSessionOnFirebase(sessionID, { passage, timeTracking, }))
      }
    }

    saveCompletedSessionToFirebase = () => {
      const { firebaseSessionID, conceptResultsObjects, } = this.state
      const { session, } = this.props
      const { passage, timeTracking, } = session
      const activityUID = getParameterByName('uid', window.location.href)
      const newOrSetFirebaseSessionID = updateConceptResultsOnFirebase(firebaseSessionID, activityUID, { conceptResults: conceptResultsObjects, timeTracking, passage, })
      this.setState({ firebaseSessionID: newOrSetFirebaseSessionID })
    }

    defaultInstructions = () => {
      return 'Find and correct the errors in the passage. To edit a word, click on it and re-type it.'
    }

    saveToLMS = () => {
      const { firebaseSessionID, conceptResultsObjects, } = this.state
      const { session, } = this.props

      const sessionID = getParameterByName('student', window.location.href)
      const results: ConceptResultObject[]|undefined = conceptResultsObjects;
      if (results) {
        const score = this.calculateScoreForLesson();
        const activityUID = getParameterByName('uid', window.location.href)

        const data = { time_tracking: roundValuesToSeconds(session.timeTracking), }

        if (sessionID) {
          this.handleCheckWorkClickSession(sessionID, results, score, data);
        } else if (activityUID) {
          this.createAnonActivitySession(activityUID, results, score, firebaseSessionID, data);
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

    handleCheckWorkClickSession = (sessionID: string, results: ConceptResultObject[], score: number, data) => {
      requestPut(
        `${process.env.DEFAULT_URL}/api/v1/activity_sessions/${sessionID}`,
        {
          state: 'finished',
          concept_results: results,
          percentage: score,
          data
        },
        (body) => {
          document.location.href = `${process.env.DEFAULT_URL}/activity_sessions/${sessionID}`;
        }
      )
    }

    createAnonActivitySession = (lessonID: string, results: ConceptResultObject[], score: number, sessionID: string|null, data) => {
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
          document.location.href = `${process.env.DEFAULT_URL}/activity_sessions/${body.activity_session.uid}`;
        }
      )

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
          const originalParagraphString = joinParagraph(paragraph)
          const paragraphSentences = sentences(originalParagraphString, {})
          const words:Array<string> = []
          paragraph.forEach((word: any) => {
            const { necessaryEditIndex, correctText, conceptUID, originalText, currentText, wordIndex } = word
            const stringNormalizedCurrentText = stringNormalize(currentText)
            const stringNormalizedCorrectText = stringNormalize(correctText)
            const stringNormalizedOriginalText = stringNormalize(originalText)
            const prompt = findSentence(paragraphSentences, wordIndex, stringNormalizedOriginalText)
            if (necessaryEditIndex || necessaryEditIndex === 0) {
              if (stringNormalizedCorrectText.split('~').includes(stringNormalizedCurrentText)) {
                numberOfCorrectChanges +=1
                conceptResultsObjects.push({
                  metadata: {
                    answer: stringNormalizedCurrentText,
                    correct: 1,
                    instructions: currentActivity.description || this.defaultInstructions(),
                    prompt,
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
                    prompt,
                    questionNumber: necessaryEditIndex + 1,
                    unchanged: stringNormalizedCurrentText === stringNormalizedOriginalText,
                  },
                  concept_uid: conceptUID,
                  question_type: "passage-proofreader"
                })
                words.push(`{+${correctText}-${stringNormalizedCurrentText}|${conceptUID}}`)
              }
            } else if (stringNormalizedOriginalText !== stringNormalizedCurrentText) {
              const displayedCurrentText = stringNormalizedCurrentText.length ? stringNormalizedCurrentText : ' '
              const unnecessaryEditType = determineUnnecessaryEditType(stringNormalizedOriginalText, stringNormalizedCurrentText)
              if (unnecessaryEditType === UNNECESSARY_SPACE) {
                const wordsToPush = unnecessarySpaceSplitResponse(stringNormalizedOriginalText, stringNormalizedCurrentText)
                wordsToPush.forEach(w => words.push(w))
              } else {
                words.push(`{+${stringNormalizedOriginalText}-${displayedCurrentText}|${unnecessaryEditType}}`)
              }
            } else {
              words.push(stringNormalizedCurrentText)
            }
          })
          reviewablePassage = reviewablePassage.concat('<p>').concat(joinWords(words.filter(word => word.length))).concat('</p>')
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

    goToFollowupPractice = () => {
      const { firebaseSessionID,  } = this.state
      window.location.href = `${process.env.QUILL_GRAMMAR_URL}/play/sw?proofreaderSessionId=${firebaseSessionID}`
    }

    goToLMS = () =>  window.location.href = `${process.env.DEFAULT_URL}`

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
          this.setState({ showFollowupModal: true, })
        }
      }
    }

    onParagraphChange = (value: Array<any>, i: number, editInput: JSX.Element) => {
      const { session, dispatch, } = this.props
      let newParagraphs = session.passage
      if (newParagraphs) {
        newParagraphs[i] = value
        const caretPosition = EditCaretPositioning.saveSelection(editInput)
        dispatch(setPassage(newParagraphs))
        this.setState({ edits: editCount(newParagraphs), }, () => EditCaretPositioning.restoreSelection(editInput, caretPosition))
      }
    }

    handleNextClick = () => {
      this.setState({ showWelcomePage: false }, () => {
        window.scrollTo(0, 0)
        this.passageContainer && this.passageContainer.focus()
      })
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
      this.setState(prevState => ({
        edits: 0,
        numberOfResets: prevState.numberOfResets + 1,
        showResetModal: false
      }))
    }

    renderShowEarlySubmitModal = (): JSX.Element|void => {
      const { showEarlySubmitModal, necessaryEdits } = this.state
      const requiredEditCount = necessaryEdits && necessaryEdits.length ? Math.floor(necessaryEdits.length / 2) : 5
      if (showEarlySubmitModal) {
        return (
          <EarlySubmitModal
            closeModal={this.closeEarlySubmitModal}
            requiredEditCount={requiredEditCount}
          />
        )
      }
    }

    renderShowResetModal = (): JSX.Element|void => {
      const { showResetModal, } = this.state
      if (showResetModal) {
        return (
          <ResetModal
            closeModal={this.closeResetModal}
            reset={this.reset}
          />
        )
      }
    }

    renderFollowupModal = (): JSX.Element|void => {
      const { showFollowupModal, } = this.state
      if (!showFollowupModal) { return }
      return (
        <FollowupModal
          goToFollowupPractice={this.goToFollowupPractice}
          goToLMS={this.goToLMS}
        />
      )
    }

    renderShowReviewModal = (): JSX.Element|void => {
      const { showReviewModal, necessaryEdits, numberOfCorrectChanges } = this.state
      const numberOfErrors = necessaryEdits && necessaryEdits.length ? necessaryEdits.length : 0
      if (showReviewModal) {
        return (
          <ReviewModal
            closeModal={this.closeReviewModal}
            numberOfCorrectChanges={numberOfCorrectChanges || 0}
            numberOfErrors={numberOfErrors}
          />
        )
      }
    }

    renderPassage = (): JSX.Element|void => {
      const { session, proofreaderActivities, concepts, } = this.props
      const { passage } = session
      const { reviewing, reviewablePassage, numberOfResets, } = this.state
      const { underlineErrorsInProofreader } = proofreaderActivities.currentActivity
      if (reviewing) {
        const text = reviewablePassage ? reviewablePassage : ''
        return (
          <PassageReviewer
            concepts={concepts.data[0]}
            finishReview={this.finishReview}
            text={text}
          />
        )
      } else if (passage) {
        const paragraphs = passage.map((p, i) => {
          return (
            <Paragraph
              handleParagraphChange={this.onParagraphChange}
              index={i}
              key={i}
              numberOfResets={numberOfResets}
              underlineErrors={underlineErrorsInProofreader}
              words={p}
            />
          )
        })
        return <div className="editor">{paragraphs}</div>
      }
    }

    renderCheckWorkButton = (): JSX.Element|void => {
      const { reviewing, edits, } = this.state
      if (reviewing) { return }

      let className = "quill-button large primary contained focus-on-light"
      if (edits) {
        return <button className={className} onClick={this.handleCheckWorkClick} type="button">Get feedback</button>
      }

      className += ' disabled'
      return <button className={className} type="button">Get feedback</button>
    }

    renderResetButton = (): JSX.Element|void => {
      const { reviewing, edits, } = this.state
      if (reviewing) { return }

      let className = "quill-button large secondary outlined focus-on-light"
      if (edits) {
        return <button className={className} onClick={this.handleResetClick} type="button">Undo edits</button>
      }

      className += ' disabled'
      return <button className={className} type="button">Undo edits</button>
    }

    render(): JSX.Element {
      const { proofreaderActivities, session, } = this.props
      const { edits, necessaryEdits, loadingFirebaseSession, showWelcomePage, } = this.state
      const { currentActivity } = proofreaderActivities

      if (showWelcomePage) { return <WelcomePage onNextClick={this.handleNextClick} /> }

      if (loadingFirebaseSession || !currentActivity) { return <div className="passage-container" ref={this.passageContainer}><LoadingSpinner /></div>}

      if (session.error) { return <div className="passage-container" ref={this.passageContainer}>{session.error}</div> }

      const className = currentActivity.underlineErrorsInProofreader ? 'underline-errors' : ''
      const necessaryEditsLength = necessaryEdits ? necessaryEdits.length : 1
      const meterWidth = edits / necessaryEditsLength * 100
      return (
        <div className="passage-container" ref={this.passageContainer}>
          <div className="header-section">
            <ProgressBar answeredQuestionCount={edits} percent={meterWidth} questionCount={necessaryEditsLength} />
            <div className="inner-header">
              <h1>{currentActivity.title}</h1>
              <div className="instructions">
                <div>
                  <img alt="Directions icon" src={directionSrc} />
                  <p dangerouslySetInnerHTML={{__html: currentActivity.description || this.defaultInstructions()}} />
                  <p className="sr-only">Screenreader users: once you have finished reading the passage, use the tab keys to navigate between words and make changes to ones that have errors. {currentActivity.underlineErrorsInProofreader && 'Words that contain errors will be described as underlined.'} Words that you have already changed will be described as bolded. There are {necessaryEditsLength} errors to find and fix. When you are done, navigate to the "Get Feedback" button after the passage and select it.</p>
                </div>
              </div>
            </div>
          </div>
          {this.renderShowEarlySubmitModal()}
          {this.renderShowResetModal()}
          {this.renderShowReviewModal()}
          {this.renderFollowupModal()}
          <div className={`passage ${className}`}>
            {this.renderPassage()}
          </div>
          <div className="bottom-section">
            <div id="button-container" tabIndex={-1}>
              {this.renderResetButton()}
              {this.renderCheckWorkButton()}
            </div>
          </div>
        </div>
      )
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
