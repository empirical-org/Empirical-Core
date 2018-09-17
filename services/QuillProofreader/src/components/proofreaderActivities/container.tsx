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
  updateSession,
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

interface ConceptResultObject {
  answer: string,
  correct: 0|1,
  instructions: string,
  prompt: string,
  questionNumber: number,
  unchanged: boolean,
  conceptUID: string
}

interface PlayProofreaderContainerProps {
  proofreaderActivities: ProofreaderActivityState;
  session: SessionState;
  dispatch: Function;
}

interface PlayProofreaderContainerState {
  passage: string;
  edits: Array<string>;
  reviewing: boolean;
  showEarlySubmitModal: boolean;
  showReviewModal: boolean;
  correctEdits?: Array<String>;
  numberOfCorrectChanges?: number;
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
      this.finishActivity = this.finishActivity.bind(this)
      this.renderShowEarlySubmitModal = this.renderShowEarlySubmitModal.bind(this)
      this.closeEarlySubmitModal = this.closeEarlySubmitModal.bind(this)
      this.renderShowReviewModal = this.renderShowReviewModal.bind(this)
      this.closeReviewModal = this.closeReviewModal.bind(this)
      this.checkWork = this.checkWork.bind(this)
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

    componentWillReceiveProps(nextProps: PlayProofreaderContainerProps) {
      if (nextProps.proofreaderActivities.hasreceiveddata && !this.state.passage) {
        const { passage, underlineErrorsInProofreader } = nextProps.proofreaderActivities.currentActivity
        const initialPassageData = this.formatInitialPassage(passage, underlineErrorsInProofreader)
        const formattedPassage = initialPassageData.passage
        this.setState({ passage: formattedPassage, originalPassage: formattedPassage, correctEdits: initialPassageData.correctEdits })
      }

      const sessionID = getParameterByName('student', window.location.href)
      if (sessionID && !_.isEqual(nextProps.session, this.props.session)) {
        updateSessionOnFirebase(sessionID, nextProps.session.passage)
      }
    }

    formatInitialPassage(passage: string, underlineErrors: boolean) {
      let correctEdits = []
      passage.replace(/{\+([^-]+)-([^|]+)\|([^}]+)}/g, (key: string, plus: string, minus: string, conceptUID: string) => {
        passage = passage.replace(key, `<u id="${correctEdits.length}">${minus}</u>`);
        correctEdits.push(key)
      });
      return {passage, correctEdits}
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
      // this method handles the fact that Slate will sometimes create additional strong tags rather than adding text inside of one
      console.log('not span stripped string', value)
      let string = value.replace(/<span data-original-index="\d+">|<\/span>|<strong> <\/strong>/gm, '').replace(/&#x27;/g, "'")
      console.log('string', string)
      // regex below matches case that looks like this: <strong><u id="3">Addison</u></strong><strong><u id="3">,</u></strong><strong><u id="3"> Parker, and Julian,</u></strong>
      const tripleStrongTagWithThreeMatchingURegex = /<strong>(<u id="\d+">)([^(<]+?)<\/u><\/strong><strong>(<u id="\d+">)([^(<]+?)<\/u><\/strong><strong>(<u id="\d+">)([^(<]+?)<\/u><\/strong>/gm
      // regex below matches case that looks like this: <strong><u id="3">Addison</u></strong><strong>,</strong><strong><u id="3"> Parker, and Julian,</u></strong>
      const tripleStrongTagWithTwoMatchingURegex = /<strong>(<u id="\d+">)([^(<]+?)<\/u><\/strong><strong>([^(<]+?)<\/strong><strong>(<u id="\d+">)([^(<]+?)<\/u><\/strong>/gm
      // regex below matches case that looks like this: <strong><u id="3">Addison</u></strong><strong><u id="3">, Parker, and Julian,</u></strong>
      const doubleStrongTagWithTwoMatchingURegex = /<strong>(<u id="\d+">)([^(<]+?)<\/u><\/strong><strong>(<u id="\d+">)([^(<]+?)<\/u><\/strong>/gm
      // regex below matches case that looks like this: <strong>Addison</strong><strong><u id="3">, Parker, and Julian,</u></strong>
      const doubleStrongTagWithUOnSecondTagRegex = /<strong>([^(<)]+?)<\/strong><strong>(<u id="\d+">)(.+?)<\/u><\/strong>/gm
      // regex below matches case that looks like this: <strong><u id="3">Addison</u></strong><strong>, Parker, and Julian,</strong>
      const doubleStrongTagWithUOnFirstTagRegex = /<strong>(<u id="\d+">)([^(<)]+?)<\/u><\/strong><strong>=(.+?)<\/strong>/gm
      // regex below matches case that looks like this: <strong>A</strong><strong>ntartctic</strong>
      const doubleStrongTagRegex = /<strong>[^(<)]+?<\/strong><strong>[^(<)]+?<\/strong>/gm
      if (tripleStrongTagWithThreeMatchingURegex.test(string)) {
        string = string.replace(tripleStrongTagWithThreeMatchingURegex, (key, uTagA, contentA, uTagB, contentB, uTagC, contentC) => {
          if (uTagA === uTagB && uTagB === uTagC) {
            return `<strong>${uTagA}${contentA}${contentB}${contentC}</u></strong>`
          } else {
            return key
          }
        })
      }
      if (tripleStrongTagWithTwoMatchingURegex.test(string)) {
        string = string.replace(tripleStrongTagWithTwoMatchingURegex, (key, uTagA, contentA, contentB, uTagC, contentC) => {
          if (uTagA === uTagC) {
            return `<strong>${uTagA}${contentA}${contentB}${contentC}</u></strong>`
          } else {
            return key
          }
        })
      }
      if (doubleStrongTagWithTwoMatchingURegex.test(string)) {
        string = string.replace(doubleStrongTagWithTwoMatchingURegex, (key, uTagA, contentA, uTagB, contentB) => {
          if (uTagA === uTagB) {
            return `<strong>${uTagA}${contentA}${contentB}</u></strong>`
          } else {
            return key
          }
        })
      }
      if (doubleStrongTagWithUOnSecondTagRegex.test(string)) {
        string = string.replace(doubleStrongTagWithUOnSecondTagRegex, (key, contentA, uTag, contentB) => {
          if (contentA.includes(' ')) {
            const splitA = contentA.split(' ')
            return `<strong>${splitA[0]}</strong> <strong>${uTag}${splitA[1]}${contentB}</u></strong>`
          } else {
            return `<strong>${uTag}${contentA}${contentB}</u></strong>`
          }
        })
      }
      if (doubleStrongTagWithUOnFirstTagRegex.test(string)) {
        string = string.replace(doubleStrongTagWithUOnSecondTagRegex, (key, uTag, contentA, contentB) => {
          if (contentB.includes(' ')) {
            const splitB = contentB.split(' ')
            return `<strong>${uTag}${contentA}${splitB[0]}</u></strong> <strong>${splitB[1]}</strong>`
          } else {
            return `<strong>${uTag}${contentA}${contentB}</u></strong>`
          }
        })
      }
      if (doubleStrongTagRegex.test(string)) {
        string = string.replace(doubleStrongTagRegex, (key) => {
          return key.replace(/<\/strong><strong>/, '')
        })
      }
      return string
    }

    handlePassageChange(value: string) {
      this.props.dispatch(updateSession(value))
      const formattedValue = this.formatReceivedPassage(value)
      const regex = /<strong>.*?<\/strong>/gm
      const edits = formattedValue.match(regex)
      if (edits) {
        this.setState({ passage: formattedValue, edits }, () => console.log('this.state.passage', this.state.passage))
      }
    }

    checkWork(): { reviewablePassage: string, numberOfCorrectChanges: number}|void {
      const { currentActivity } = this.props.proofreaderActivities
      const { correctEdits, passage } = this.state
      let numberOfCorrectChanges = 0
      const correctEditRegex = /\+([^-]+)-/m
      const originalTextRegex = /\-([^|]+)\|/m
      const conceptUIDRegex = /\|([^}]+)}/m
      const conceptResultsObjects: Array<ConceptResultObject> = []
      if (passage && correctEdits) {
        const gradedPassage = passage.replace(/<strong>(.*?)<\/strong>/gm , (key, edit) => {
          const uTag = edit.match(/<u id="(\d+)">(.+)<\/u>/m)
          if (uTag && uTag.length) {
            const id = uTag[1]
            const text = uTag[2]
            if (correctEdits && correctEdits[id]) {
              const correctEdit = correctEdits[id].match(correctEditRegex) ? correctEdits[id].match(correctEditRegex)[1] : ''
              const conceptUID = correctEdits[id].match(conceptUIDRegex) ? correctEdits[id].match(conceptUIDRegex)[1] : ''
              const originalText = correctEdits[id].match(originalTextRegex) ? correctEdits[id].match(originalTextRegex)[1] : ''
              if (text === correctEdit) {
                numberOfCorrectChanges++
                conceptResultsObjects.push({
                  answer: text,
                  correct: 1,
                  instructions: currentActivity.description,
                  prompt: originalText,
                  questionNumber: id + 1,
                  unchanged: false,
                  conceptUID: conceptUID
                })
                return `{+${text}-|${conceptUID}}`
              } else {
                conceptResultsObjects.push({
                  answer: text,
                  correct: 0,
                  instructions: currentActivity.description,
                  prompt: originalText,
                  questionNumber: id + 1,
                  unchanged: false,
                  conceptUID: conceptUID
                })
                return `{+${correctEdit}-${text}|${conceptUID}}`
              }
            } else {
              return `{+${text}-|unnecessary}`
            }
          } else {
            return `{+${edit}-|unnecessary}`
          }
        })
        const reviewablePassage = gradedPassage.replace(/<u id="(\d+)">(.+?)<\/u>/gm, (key, id, text) => {
          if (correctEdits && correctEdits[id]) {
            const conceptUID = correctEdits[id].match(conceptUIDRegex) ? correctEdits[id].match(conceptUIDRegex)[1] : ''
            const originalText = correctEdits[id].match(originalTextRegex) ? correctEdits[id].match(originalTextRegex)[1] : ''
            conceptResultsObjects.push({
              answer: text,
              correct: 0,
              instructions: currentActivity.description,
              prompt: originalText,
              questionNumber: id + 1,
              unchanged: false,
              conceptUID: conceptUID
            })
            return correctEdits[id]
          } else {
            return `${text} `
          }
        }).replace(/<br\/>/gm, '')
        return { reviewablePassage, numberOfCorrectChanges}
      }
    }

    finishActivity() {
      const { edits, correctEdits } = this.state
      const requiredEditCount = correctEdits && correctEdits.length ? Math.floor(correctEdits.length/2) : 5
      if (correctEdits && correctEdits.length && edits.length === 0 || edits.length < requiredEditCount) {
        this.setState({showEarlySubmitModal: true})
      } else {
        const { reviewablePassage, numberOfCorrectChanges } = this.checkWork()
        this.setState( { reviewablePassage, showReviewModal: true, numberOfCorrectChanges} )
      }
    }

    renderShowEarlySubmitModal(): JSX.Element|void {
      const { showEarlySubmitModal, correctEdits } = this.state
      const requiredEditCount = correctEdits && correctEdits.length ? Math.floor(correctEdits.length/2) : 5
      if (showEarlySubmitModal) {
        return <EarlySubmitModal
          requiredEditCount={requiredEditCount}
          closeModal={this.closeEarlySubmitModal}
        />
      }
    }

    renderShowReviewModal(): JSX.Element|void {
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

    renderPassage(): JSX.Element|void {
      const { reviewing, reviewablePassage, originalPassage } = this.state
      const { passageFromFirebase } = this.props.session
      if (reviewing) {
        const text = reviewablePassage ? reviewablePassage : ''
        return <PassageReviewer
          text={text}
          concepts={this.props.concepts.data[0]}
        />
      } else if (originalPassage) {
        return <PassageEditor
          savedText={passageFromFirebase}
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
      const { edits, correctEdits} = this.state
      const { currentActivity } = this.props.proofreaderActivities
      const numberOfCorrectEdits = correctEdits ? correctEdits.length : 0
      if (this.props.proofreaderActivities.hasreceiveddata) {
        const className = currentActivity.underlineErrorsInProofreader ? 'underline-errors' : ''
        const meterWidth = edits.length / correctEdits.length * 100
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
          {this.renderShowReviewModal()}
          <div className={`passage ${className}`}>
            {this.renderPassage()}
          </div>
          <div className="bottom-section">
            <button onClick={this.finishActivity}>Check Work</button>
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
