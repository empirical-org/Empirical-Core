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
  updateSession,
  setSessionReducerToSavedSession
} from "../../actions/session";
// import { getConceptResultsForAllQuestions, calculateScoreForLesson } from '../../helpers/conceptResultsGenerator'
import { SessionState } from '../../reducers/sessionReducer'
import { ProofreaderActivityState } from '../../reducers/proofreaderActivitiesReducer'
import { ConceptResultObject } from '../../interfaces/proofreaderActivities'
import PassageEditor from './passageEditor'
import PassageReviewer from './passageReviewer'
import EarlySubmitModal from './earlySubmitModal'
import ResetModal from './resetModal'
import ReviewModal from './reviewModal'
import LoadingSpinner from '../shared/loading_spinner'

// interface PlayProofreaderContainerProps {
//   proofreaderActivities: ProofreaderActivityState;
//   session: SessionState;
//   dispatch: Function;
//   admin?: Boolean;
//   activityUID?: string;
// }
//
// interface PlayProofreaderContainerState {
//   passage?: string;
//   edits: string[];
//   reviewing: boolean;
//   resetting: boolean;
//   showEarlySubmitModal: boolean;
//   showReviewModal: boolean;
//   showResetModal: boolean;
//   editsWithOriginalValue: Array<{index: string, originalText: string, currentText: string}>;
//   necessaryEdits?: String[];
//   numberOfCorrectChanges?: number;
//   originalPassage?: string;
//   reviewablePassage?: string;
//   conceptResultsObjects?: ConceptResultObject[];
// }

interface PlayProofreaderContainerProps {
  [key: string]: any
}
//
interface PlayProofreaderContainerState {
  [key: string]: any
}


export class PlayProofreaderContainer extends React.Component<PlayProofreaderContainerProps, PlayProofreaderContainerState> {
    constructor(props: any) {
      super(props);

      this.state = {
        edits: [],
        reviewing: false,
        showEarlySubmitModal: false,
        showReviewModal: false,
        showResetModal: false,
        editsWithOriginalValue: [],
        resetting: false
      }

      this.saveToLMS = this.saveToLMS.bind(this)
      this.finishActivitySession = this.finishActivitySession.bind(this)
      this.finishReview = this.finishReview.bind(this)
      this.createAnonActivitySession = this.createAnonActivitySession.bind(this)
      this.handlePassageChange = this.handlePassageChange.bind(this)
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
    }

    componentWillMount() {
      const activityUID = getParameterByName('uid', window.location.href) || this.props.activityUID
      const sessionID = getParameterByName('student', window.location.href)

      this.props.dispatch(startListeningToConcepts())

      if (sessionID) {
        this.props.dispatch(setSessionReducerToSavedSession(sessionID))
      }

      if (activityUID) {
        this.props.dispatch(getActivity(activityUID))
      }

    }

    componentWillReceiveProps(nextProps: PlayProofreaderContainerProps) {
      if (nextProps.proofreaderActivities.currentActivity && !this.state.passage) {
        const { passage } = nextProps.proofreaderActivities.currentActivity
        const initialPassageData = this.formatInitialPassage(passage)
        const formattedPassage = initialPassageData.passage
        this.setState({ passage: formattedPassage, originalPassage: formattedPassage, necessaryEdits: initialPassageData.necessaryEdits })
      }

      // if (!_.isEqual(nextProps.proofreaderActivities.currentActivity, this.props.proofreaderActivities.currentActivity)) {
      //   const { passage, underlineErrorsInProofreader } = nextProps.proofreaderActivities.currentActivity
      //   const initialPassageData = this.formatInitialPassage(passage, underlineErrorsInProofreader)
      //   const formattedPassage = initialPassageData.passage
      //   this.setState({ passage: formattedPassage, originalPassage: formattedPassage, necessaryEdits: initialPassageData.necessaryEdits })
      // }
      //
      const sessionID = getParameterByName('student', window.location.href)
      if (sessionID && !_.isEqual(nextProps.session, this.props.session)) {
        updateSessionOnFirebase(sessionID, nextProps.session.passage)
      }
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
      const conceptUIDRegex = /\|([^}]+)}/m
      const paragraphs = passage.split('<br/>')
      let necessaryEditCounter = 0
      const passageArray = paragraphs.map((paragraph, paragraphIndex) => {
        return paragraph.split(/{|}/).map((text, i) => {
          let wordObj
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
            necessaryEditCounter++
          } else {
            wordObj = {
              originalText: text,
              currentText: text,
              correctText: text,
              underlined: false,
              wordIndex: i,
              paragraphIndex
            }
          }
          return wordObj
        })
      })
      return {passage: passageArray, necessaryEdits}
    }

    saveToLMS() {
      const results: ConceptResultObject[]|undefined = this.state.conceptResultsObjects;
      if (results) {
      const score = this.calculateScoreForLesson();
      const activityUID = getParameterByName('uid', window.location.href)
      const sessionID = getParameterByName('student', window.location.href)
      if (sessionID) {
        this.finishActivitySession(sessionID, results, score);
      } else if (activityUID) {
        this.createAnonActivitySession(activityUID, results, score);
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
            document.location.href = `${process.env.EMPIRICAL_BASE_URL}/activity_sessions/${sessionID}`;
          }
        }
      );
    }

    createAnonActivitySession(lessonID: string, results: ConceptResultObject[], score: number) {
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
          }
        }
      );
    }

    // this method handles weirdness created by HTML formatting in Slate
    handlePassageChange(value: string, editsWithOriginalValue: Array<{index: string, originalText: string, currentText: string}>) {
      this.props.dispatch(updateSession(value))
      // const formattedValue = this.formatReceivedPassage(value)
      // const regex = /<strong>.*?<\/strong>/gm
      // const edits = formattedValue.match(regex)
      // if (edits) {
      //   this.setState({ passage: formattedValue, edits, editsWithOriginalValue })
      // } else if (this.state.edits) {
      //   this.setState({ passage: formattedValue, edits: [], editsWithOriginalValue })
      // }
    }

    checkWork(): { reviewablePassage: string, numberOfCorrectChanges: number, conceptResultsObjects: ConceptResultObject[]}|void {
      const { currentActivity } = this.props.proofreaderActivities
      const { necessaryEdits, passage, editsWithOriginalValue } = this.state
      let remainingEditsWithOriginalValue = editsWithOriginalValue
      let numberOfCorrectChanges = 0
      const correctEditRegex = /\+([^-]+)-/m
      const originalTextRegex = /\-([^|]+)\|/m
      const conceptUIDRegex = /\|([^}]+)}/m
      const conceptResultsObjects: ConceptResultObject[] = []
      if (passage && necessaryEdits) {
        const gradedPassage = passage.replace(/<strong>(.*?)<\/strong>/gm , (key, edit) => {
          const uTag = edit.match(/<u id="(\d+)">(.+)<\/u>/m)
          if (uTag && uTag.length) {
            const id = Number(uTag[1])
            const stringNormalizedText = stringNormalize(uTag[2])
            const text = stringNormalizedText.trim()
            if (necessaryEdits && necessaryEdits[id]) {
              const correctEdit = necessaryEdits[id].match(correctEditRegex) ? stringNormalize(necessaryEdits[id].match(correctEditRegex)[1]).replace(/&#x27;/g, "'") : ''
              const conceptUID = necessaryEdits[id].match(conceptUIDRegex) ? necessaryEdits[id].match(conceptUIDRegex)[1] : ''
              const originalText = necessaryEdits[id].match(originalTextRegex) ? necessaryEdits[id].match(originalTextRegex)[1] : ''
              if (correctEdit.split('~').includes(text)) {
                numberOfCorrectChanges++
                conceptResultsObjects.push({
                  metadata: {
                    answer: text,
                    correct: 1,
                    instructions: currentActivity.description || this.defaultInstructions(),
                    prompt: originalText,
                    questionNumber: id + 1,
                    unchanged: false,
                  },
                  concept_uid: conceptUID,
                  question_type: "passage-proofreader"
                })
                return `{+${stringNormalizedText}-|${conceptUID}}`
              } else {
                conceptResultsObjects.push({
                  metadata: {
                    answer: text,
                    correct: 0,
                    instructions: currentActivity.description || this.defaultInstructions(),
                    prompt: originalText,
                    questionNumber: id + 1,
                    unchanged: false,
                  },
                  concept_uid: conceptUID,
                  question_type: "passage-proofreader"
                })
                return `{+${correctEdit}-${stringNormalizedText}|${conceptUID}}`
              }
            } else {
              const editObject = remainingEditsWithOriginalValue.find(editObj => editObj.currentText === edit)
              if (editObject) {
                remainingEditsWithOriginalValue = remainingEditsWithOriginalValue.filter(edit => edit.index !== editObject.index)
                return `{+${editObject.originalText}-${stringNormalizedText}|unnecessary}`
              } else {
                return `{+-${edit}|unnecessary}`
              }
            }
          } else {
            const editObject = remainingEditsWithOriginalValue.find(editObj => editObj.currentText === edit)
            if (editObject) {
              remainingEditsWithOriginalValue = remainingEditsWithOriginalValue.filter(edit => edit.index !== editObject.index)
              return `{+${editObject.originalText}-${edit}|unnecessary}`
            } else {
              return `{+-${edit}|unnecessary}`
            }
          }
        })
        const reviewablePassage = gradedPassage.replace(/<u id="(\d+)">(.+?)<\/u>/gm, (key, id, text) => {
          if (necessaryEdits && necessaryEdits[id]) {
            const conceptUID = necessaryEdits[id].match(conceptUIDRegex) ? necessaryEdits[id].match(conceptUIDRegex)[1] : ''
            const originalText = necessaryEdits[id].match(originalTextRegex) ? necessaryEdits[id].match(originalTextRegex)[1] : ''
            const correctEdit = necessaryEdits[id].match(correctEditRegex) ? stringNormalize(necessaryEdits[id].match(correctEditRegex)[1]).replace(/&#x27;/g, "'") : ''
            if (correctEdit.split('~').includes(text)) {
              conceptResultsObjects.push({
                metadata: {
                  answer: text,
                  correct: 1,
                  instructions: currentActivity.description || this.defaultInstructions(),
                  prompt: originalText,
                  questionNumber: Number(id) + 1,
                  unchanged: true,
                },
                concept_uid: conceptUID,
                question_type: "passage-proofreader"
              })
              return `{+${text}-|${conceptUID}}`
            } else {
              conceptResultsObjects.push({
                metadata: {
                  answer: text,
                  correct: 0,
                  instructions: currentActivity.description || this.defaultInstructions(),
                  prompt: originalText,
                  questionNumber: Number(id) + 1,
                  unchanged: true,
                },
                concept_uid: conceptUID,
                question_type: "passage-proofreader"
              })
              return necessaryEdits[id]
            }
          } else {
            return `${text} `
          }
        }).replace(/<br\/>/gm, '')
        return { reviewablePassage, numberOfCorrectChanges, conceptResultsObjects }
      }
    }

    finishActivity() {
      const { edits, necessaryEdits } = this.state
      const requiredEditCount = necessaryEdits && necessaryEdits.length ? Math.floor(necessaryEdits.length / 2) : 5
      if (necessaryEdits && necessaryEdits.length && edits.length === 0 || edits.length < requiredEditCount) {
        this.setState({showEarlySubmitModal: true})
      } else {
        const { reviewablePassage, numberOfCorrectChanges, conceptResultsObjects } = this.checkWork()
        console.log('conceptResultsObjects', conceptResultsObjects)
        console.log('numberOfCorrectChanges', numberOfCorrectChanges)
        console.log('reviewablePassage', reviewablePassage)
        this.setState( { reviewablePassage, showReviewModal: true, numberOfCorrectChanges, conceptResultsObjects } )
      }
    }

    finishReview() {
      const activityUID = getParameterByName('uid', window.location.href)
      const sessionID = getParameterByName('student', window.location.href)
      const { conceptResultsObjects, necessaryEdits, numberOfCorrectChanges } = this.state
      if (this.props.admin) {
        this.setState({
          passage: this.state.originalPassage,
          edits: [],
          reviewing: false,
          showEarlySubmitModal: false,
          showReviewModal: false,
          numberOfCorrectChanges: undefined,
          reviewablePassage: undefined,
          conceptResultsObjects: undefined
        })
      } else if (conceptResultsObjects && activityUID) {
        const firebaseSessionID = updateConceptResultsOnFirebase(sessionID, activityUID, conceptResultsObjects)
        if (necessaryEdits && (necessaryEdits.length === numberOfCorrectChanges)) {
          this.saveToLMS()
        } else if (firebaseSessionID) {
          window.location.href = `${process.env.QUILL_GRAMMAR_URL}/play/sw?proofreaderSessionId=${firebaseSessionID}`
        }
      }
    }

    handleParagraphChange(i: Number, value: Array<any>) {
      let newParagraphs = this.state.passage
      newParagraphs[i] = value
      this.setState({ passage: newParagraphs, })
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
      const { passage, underlineErrorsInProofreader } = this.props.proofreaderActivities.currentActivity
      const initialPassageData = this.formatInitialPassage(passage, underlineErrorsInProofreader)
      const formattedPassage = initialPassageData.passage
      this.setState({
        passage: formattedPassage,
        originalPassage: formattedPassage,
        necessaryEdits: initialPassageData.necessaryEdits,
        edits: [],
        editsWithOriginalValue: [],
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
      const { reviewing, reviewablePassage, originalPassage, resetting, passage } = this.state
      const { passageFromFirebase } = this.props.session
      if (reviewing) {
        const text = reviewablePassage ? reviewablePassage : ''
        return <PassageReviewer
          text={text}
          concepts={this.props.concepts.data[0]}
          finishReview={this.finishReview}
        />
      } else if (originalPassage) {
        const paragraphs = passage.map((p, i) => {
          return <Paragraph
            words={p}
            handleParagraphChange={(value) => this.handleParagraphChange(i. value)}
            resetting={resetting}
            finishReset={this.finishReset}
          />
        })
        return <div>{paragraphs}</div>
        // return <PassageEditor
        //   key={this.props.proofreaderActivities.currentActivity.passage}
        //   savedText={passageFromFirebase}
        //   text={originalPassage}
        //   handleTextChange={this.handlePassageChange}
        //   resetting={resetting}
        //   finishReset={this.finishReset}
        // />
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
        if (edits.length) {
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
        const meterWidth = edits.length / necessaryEditsLength * 100
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
                  <p>Edits Made: {edits.length} of {numberOfCorrectEdits}</p>
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
