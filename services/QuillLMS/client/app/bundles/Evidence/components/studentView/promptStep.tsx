import * as React from 'react'
import stripHtml from "string-strip-html"

import EditorContainer from './editorContainer'
import Feedback from './feedback'

import EditCaretPositioning from '../../helpers/EditCaretPositioning'
import ButtonLoadingSpinner from '../shared/buttonLoadingSpinner'
import { highlightGrammar, highlightSpelling, stripEvidenceHtml } from '../../libs/stringFormatting'

interface PromptStepProps {
  activityIsComplete: Boolean;
  className: string,
  completionButtonCallback: () => void;
  submitResponse: Function;
  completeStep: (event: any) => void;
  stepNumber: number;
  activateStep: (event: any) => void;
  reportAProblem: ({}) => void;
  prompt: any,
  submittedResponses: Array<any>,
}

interface PromptStepState {
  html: string;
  numberOfSubmissions: number;
  customFeedback: string|null;
  customFeedbackKey: string|null;
  responseOverCharacterLimit: boolean;
  submissionTime: number;
  timeAtLastFeedbackSubmissionCheck: number;
  failedToLoadFeedback: boolean;
}

const RESPONSE = 'response'
const PROMPT = 'prompt'
export const DIRECTIONS = 'Use information from the text to finish the sentence:'
const APPROACHING_LIMIT_MESSAGE = 'Your response is getting close to the maximum length';
const OVER_LIMIT_MESSSAGE = 'Your response is too long for our feedback bot to understand';
const WARNING_THRESHOLD = 160;
const LIMIT_THRESHOLD = 200;
const MAX_ATTEMPTS = 5;
const SLOW_FEEDBACK_CONSTRAINT = 10000;
const FEEDBACK_LOADING_LIMIT = 30000;

export class PromptStep extends React.Component<PromptStepProps, PromptStepState> {
  private editor: any // eslint-disable-line react/sort-comp
  private interval: any // eslint-disable-line react/sort-comp
  private button: any // eslint-disable-line react/sort-comp


  constructor(props: PromptStepProps) {
    super(props)

    const { submittedResponses, } = this.props

    this.state = {
      html: this.formattedPrompt(submittedResponses),
      numberOfSubmissions: submittedResponses.length,
      customFeedback: null,
      customFeedbackKey: null,
      responseOverCharacterLimit: false,
      submissionTime: 0,
      failedToLoadFeedback: false,
      timeAtLastFeedbackSubmissionCheck: 0
    };

    this.editor = React.createRef()
    this.button = React.createRef()
    this.interval = null;
  }


  componentDidUpdate() {
    const { submittedResponses } = this.props;
    const { numberOfSubmissions, submissionTime, timeAtLastFeedbackSubmissionCheck, failedToLoadFeedback } = this.state;
    const timeLapsed = Math.abs(timeAtLastFeedbackSubmissionCheck - submissionTime)
    const awaitingFeedback = (numberOfSubmissions !== submittedResponses.length) && !failedToLoadFeedback

    if(submissionTime && numberOfSubmissions === submittedResponses.length) {
      this.setState({ submissionTime: 0, timeAtLastFeedbackSubmissionCheck: 0 });
      clearInterval(this.interval);
    }
    if(timeAtLastFeedbackSubmissionCheck && timeLapsed >= FEEDBACK_LOADING_LIMIT && !failedToLoadFeedback) {
      const feedbackFailedToLoadText = 'Sorry, our feedback did not load properly. Please try again or refresh the page.'
      this.setState({ failedToLoadFeedback: true, customFeedback: feedbackFailedToLoadText, customFeedbackKey: 'feedback failed' });
    }
    if(awaitingFeedback) {
      this.button.current.focus()
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  lastSubmittedResponse = () => {
    const { submittedResponses, } = this.props
    return submittedResponses.length ? submittedResponses[submittedResponses.length - 1] : {}
  }

  unsubmittableResponses = () => {
    const { submittedResponses, prompt } = this.props
    const { text } = prompt;
    return submittedResponses.map(r => r.entry).concat(text)
  }

  stripHtml = (html: string) => html.replace(/<p>|<\/p>|<u>|<\/u>|<b>|<\/b>|<br>|<br\/>/g, '').replace(/&nbsp;/g, ' ')

  formattedPrompt = (submittedResponses?: Array<string>) => {
    if (submittedResponses && submittedResponses.length) {
      const lastSubmission = submittedResponses[submittedResponses.length - 1]
      const formattedText = this.formatHtmlForEditorContainer(lastSubmission.entry, true)
      return formattedText.htmlWithBolding
    }
    return this.formattedStem()
  }

  formattedStem = () => {
    const { prompt, } = this.props
    const { text } = prompt
    return `<p>${this.allButLastWord(text)} <u>${this.lastWord(text)}</u>&nbsp;</p>`
  }

  allButLastWord = (str: string) => str.substring(0, str.lastIndexOf(' '))

  lastWord = (str: string) => str.substring(str.lastIndexOf(' ') + 1)

  textWithoutStem = (text: string) => {
    const regex = this.promptAsRegex()
    return text.replace(regex, '')
  }

  highlightsAddedPrompt = (str: string) => {
    const { prompt, submittedResponses, } = this.props
    const lastSubmittedResponse = this.lastSubmittedResponse()

    if (!lastSubmittedResponse || !lastSubmittedResponse.highlight || !lastSubmittedResponse.entry || submittedResponses.length === prompt.max_attempts) { return str }

    const thereArePromptHighlights = lastSubmittedResponse.highlight.filter(hl => hl.type === PROMPT).length
    if (!thereArePromptHighlights) {
      return str
    }

    let wordsToFormat = lastSubmittedResponse.highlight.filter(hl => hl.type === PROMPT).map(hl => stripEvidenceHtml(hl.text))
    wordsToFormat = wordsToFormat.length === 1 ? wordsToFormat[0] : wordsToFormat
    return highlightSpelling(str, wordsToFormat)
  }

  formatStudentResponse = (str: string) => {
    const { prompt, submittedResponses, } = this.props
    const lastSubmittedResponse = this.lastSubmittedResponse()

    if (!lastSubmittedResponse || !lastSubmittedResponse.highlight || !lastSubmittedResponse.entry || submittedResponses.length === prompt.max_attempts) { return str }

    const thereAreResponseHighlights = lastSubmittedResponse.highlight.filter(hl => hl.type === RESPONSE).length

    if (!thereAreResponseHighlights) { return str }

    const filteredHighlights = lastSubmittedResponse.highlight.filter(hl => hl.type === RESPONSE)

    let wordsToFormat = filteredHighlights.map(hl => stripEvidenceHtml(hl.text))

    wordsToFormat = wordsToFormat.length === 1 ? wordsToFormat[0] : wordsToFormat

    if (lastSubmittedResponse.feedback_type === 'plagiarism') {
      return this.formatPlagiarismHighlight(str, wordsToFormat)
    } else if (lastSubmittedResponse.feedback_type === 'grammar') {
      return highlightGrammar(str, filteredHighlights)
    } else {
      return highlightSpelling(str, wordsToFormat)
    }
  }

  formatPlagiarismHighlight = (str: string, wordsToFormat: string) => {
    let boldedString = `<b>${wordsToFormat}</b>`
    return str.replace(wordsToFormat, boldedString)
  }

  htmlStrippedPrompt = (escapeRegexCharacters=false) => {
    const strippedPrompt = this.formattedStem().replace(/<p>|<\/p>|<br>/g, '')
    if (escapeRegexCharacters) {
      return strippedPrompt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    return strippedPrompt
  }

  promptAsRegex = () => new RegExp(`^${this.htmlStrippedPrompt(true)}`)

  onTextChange = (e) => {
    const { value } = e.target
    const text = value.replace(/<b>|<\/b>|<p>|<\/p>|<br>/g, '')
    const regex = this.promptAsRegex()
    const caretPosition = EditCaretPositioning.saveSelection(this.editor)
    if (text.match(regex)) {
      this.setState({ html: value, }, () => EditCaretPositioning.restoreSelection(this.editor, caretPosition))
      // if the student has deleted everything, we want to remove everything but the prompt stem
    } else if (!text.length) {
      this.resetText()
    } else {
      const htmlStrippedPrompt = this.htmlStrippedPrompt()
      const splitSubmission = text.split('&nbsp;')

      // handles case where change is only in the formatted prompt part
      if (splitSubmission.length > 1) {
        const newValue = `${htmlStrippedPrompt}${splitSubmission[splitSubmission.length - 1]}`
        this.setState({ html: newValue}, () => {
          this.editor.innerHTML = newValue
        })
      // student overwrote or deleted both part of their submission and the formatted prompt and the solution is much more complicated
      } else {
        const formattedPromptWordArray = htmlStrippedPrompt.split(' ')
        const textWordArray = text.replace(/&nbsp;/g, ' ').split(' ')

        // if the user has tried to edit part of the original prompt, we find the words in their submission that are different from the original prompt
        const diffIndices: number[] = []
        formattedPromptWordArray.forEach((word: string, i: number) => {
          if ((textWordArray[i] !== word)) {
            diffIndices.push(i)
          }
        })

        let newTextWordArray = textWordArray.slice(0, diffIndices[0])
        const textToAddAfterPromptText: string[] = []

        // then we add each of the words from the original prompt that they modified or removed back in
        diffIndices.forEach((originalIndex: number) => {
          const diffWordEquivalent = formattedPromptWordArray[originalIndex]
          newTextWordArray.push(diffWordEquivalent)
          const diffWordWithoutHtmlLettersArray = textWordArray[originalIndex] ? stripEvidenceHtml(textWordArray[originalIndex]).split('') : null
          if (diffWordWithoutHtmlLettersArray) {
            const diffWordEquivalentWithoutHtmlLettersArray = stripEvidenceHtml(diffWordEquivalent)
            const indexOfLettersToKeepFromDiffWord = diffWordWithoutHtmlLettersArray.findIndex((letter: string, i: number) => letter !== diffWordEquivalentWithoutHtmlLettersArray[i])
            if (indexOfLettersToKeepFromDiffWord !== -1) {
              const partOfDiffWordToKeep = diffWordWithoutHtmlLettersArray.slice(indexOfLettersToKeepFromDiffWord).join('').replace(/(&nbsp;)|(<u>)|(<\/u>)/g, '')
              // keeping track of what they'd modified it to be, so we don't lose those changes
              textToAddAfterPromptText.push(partOfDiffWordToKeep)
            }
          }
        })

        const restOfSubmission = textWordArray.slice(diffIndices[diffIndices.length - 1] + 1)

        // then we concatenate the original text, however they had changed their submission, and the rest of the submission
        newTextWordArray = newTextWordArray.concat(textToAddAfterPromptText).concat(restOfSubmission)

        const newValue = newTextWordArray.join(' ').replace(/&nbsp;\s/g, '&nbsp;')

        this.setState({ html: newValue}, () => {
          this.editor.innerHTML = newValue
        })
      }
    }

    this.setState({ customFeedback: null, customFeedbackKey: null })
  }

  resetText = () => {
    const html = this.formattedStem()
    this.setState({ html }, () => this.editor.innerHTML = html)
  }

  setEditorRef = (node: JSX.Element) => this.editor = node

  onFocus = () => {
    // following code ensures tabbing into editor always puts cursor at the end of the text
    const el = this.editor
    // retrieved from https://stackoverflow.com/a/4238971
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
      const textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }

  handleGetFeedbackClick = (entry: string, promptId: string, promptText: string) => {
    const { submitResponse, } = this.props

    this.setState(prevState => ({
      numberOfSubmissions: prevState.numberOfSubmissions + 1,
      submissionTime: (new Date()).getTime(),
      failedToLoadFeedback: false,
      customFeedback: null,
      customFeedbackKey: null
    }), () => {
      const { numberOfSubmissions, } = this.state
      submitResponse(entry, promptId, promptText, numberOfSubmissions)
      this.interval = setInterval(() => this.setState({ timeAtLastFeedbackSubmissionCheck: (new Date()).getTime() }), 1000);
    })
  }

  onStepInteraction = (e) => {
    const { key, ctrlKey, metaKey, } = e
    const { activateStep, stepNumber, } = this.props

    if (key === "5" && ctrlKey && metaKey) {
      this.completeStep()
    } else {
      activateStep(stepNumber)
    }
  }

  completeStep = () => {
    const { completeStep, stepNumber, } = this.props

    completeStep(stepNumber)
  }

  formatHtmlForEditorContainer = (html: string) => {
    const { prompt, } = this.props
    const text = html.replace(/<b>|<\/b>|<p>|<\/p>|<br>|<u>|<\/u>/g, '').replace('&nbsp;', '')
    const textWithoutStem = text.replace(prompt.text, '').trim()
    const textForCharacterCount = stripHtml(textWithoutStem);
    const spaceAtEnd = text.match(/\s$/m) ? '&nbsp;' : ''
    return {
      htmlWithBolding: `<p>${this.highlightsAddedPrompt(this.htmlStrippedPrompt())}${this.formatStudentResponse(textWithoutStem)}${spaceAtEnd}</p>`,
      rawTextWithoutStem: textWithoutStem,
      textForCharacterCount
    }
  }

  getFeedbackLoadingDetails = () => {
    const { submissionTime, timeAtLastFeedbackSubmissionCheck } = this.state
    if(!submissionTime) {
      return <span />
    }
    const timeLapsed = Math.abs(timeAtLastFeedbackSubmissionCheck - submissionTime)
    if(timeLapsed <= SLOW_FEEDBACK_CONSTRAINT) {
      return <p>Finding feedback...</p>
    } else if(timeLapsed > SLOW_FEEDBACK_CONSTRAINT && timeLapsed <= FEEDBACK_LOADING_LIMIT) {
      return <p>Still finding feedback. Thanks for your patience!</p>
    }
    return <span />
  }

  renderFeedbackButtonAndDetails = () => {
    const { prompt, submittedResponses, completionButtonCallback, activityIsComplete} = this.props
    const { id, text, max_attempts } = prompt
    const { html, numberOfSubmissions, responseOverCharacterLimit, failedToLoadFeedback } = this.state
    const entry = stripEvidenceHtml(html).trim()
    const awaitingFeedback = (numberOfSubmissions !== submittedResponses.length) && !failedToLoadFeedback
    const buttonLoadingSpinner = awaitingFeedback ? <ButtonLoadingSpinner /> : null
    let buttonCopy = 'Get feedback'
    let className = 'quill-button focus-on-light'
    let onClick = () => this.handleGetFeedbackClick(entry, id, text)

    if (activityIsComplete) {
      onClick = completionButtonCallback
      buttonCopy = 'Done'
    } else if (submittedResponses.length === max_attempts || this.lastSubmittedResponse().optimal) {
      onClick = this.completeStep
      buttonCopy = 'Next'
    } else if (this.unsubmittableResponses().includes(entry) || awaitingFeedback || responseOverCharacterLimit) {
      className += ' disabled'
      onClick = () => {}
    }

    if(awaitingFeedback) {
      buttonCopy = ''
    }

    return(
      <div className="feedback-details-section">
        {this.getFeedbackLoadingDetails()}
        <button className={className} onClick={onClick} ref={this.button} type="button">{buttonLoadingSpinner}<span>{buttonCopy}</span></button>
      </div>
    )
  }

  renderFeedbackSection = () => {
    const { customFeedback, customFeedbackKey, } = this.state
    const { submittedResponses, prompt, reportAProblem, } = this.props
    if (submittedResponses.length === 0 && !(customFeedback && customFeedbackKey)) { return }

    return (
      <Feedback
        customFeedback={customFeedback}
        customFeedbackKey={customFeedbackKey}
        lastSubmittedResponse={this.lastSubmittedResponse()}
        prompt={prompt}
        reportAProblem={reportAProblem}
        submittedResponses={submittedResponses}
      />
    )
  }

  renderCharacterLimitWarning = (characterCount: number, characterCountClassName: string) => {
    if(characterCount < WARNING_THRESHOLD) { return }
    const message = characterCount < LIMIT_THRESHOLD ? APPROACHING_LIMIT_MESSAGE : OVER_LIMIT_MESSSAGE;
    return(
      <div className="character-counter-container">
        <p className={characterCountClassName}>{message}</p>
        <p className={characterCountClassName}>{`${characterCount}/${LIMIT_THRESHOLD}`}</p>
      </div>
    )
  }

  renderEditorContainer = () => {
    const { html, responseOverCharacterLimit } = this.state
    const { submittedResponses, prompt } = this.props
    const lastSubmittedResponse = this.lastSubmittedResponse()
    let className = 'editor'
    let disabled = false
    const outOfAttempts = submittedResponses.length === prompt.max_attempts
    if (lastSubmittedResponse.optimal) {
      className += ' optimal disabled'
      disabled = true
    } else if (outOfAttempts) {
      className += ' suboptimal disabled'
      disabled = true
    } else if (submittedResponses.length) {
      className += ' suboptimal'
    }

    const formattedText = this.formatHtmlForEditorContainer(html)
    const { htmlWithBolding, rawTextWithoutStem, textForCharacterCount } = formattedText
    const characterCount = textForCharacterCount && textForCharacterCount.split('').length;
    let characterCountClassName;
    if(characterCount >= WARNING_THRESHOLD && characterCount < LIMIT_THRESHOLD) {
      characterCountClassName = 'approaching-limit';
    } else if (characterCount >= LIMIT_THRESHOLD) {
      characterCountClassName = 'over-limit';
    }
    if(characterCountClassName) {
      className += ` ${characterCountClassName}`;
    }
    if(characterCount >= LIMIT_THRESHOLD && !responseOverCharacterLimit) {
      this.setState({ responseOverCharacterLimit: true });
    } else if(characterCount < LIMIT_THRESHOLD && responseOverCharacterLimit) {
      this.setState({ responseOverCharacterLimit: false });
    }

    return (
      <div>
        <EditorContainer
          className={className}
          disabled={disabled}
          handleFocus={this.onFocus}
          handleKeyDown={this.onStepInteraction}
          handleTextChange={this.onTextChange}
          html={htmlWithBolding}
          innerRef={this.setEditorRef}
          isResettable={!!rawTextWithoutStem.length}
          promptText={prompt.text}
          resetText={this.resetText}
          stripHtml={stripEvidenceHtml}
        />
        {this.renderCharacterLimitWarning(characterCount, characterCountClassName)}
      </div>
    );
  }

  renderActiveContent = () => {
    const { prompt, submittedResponses } = this.props;
    const attemptsCount = submittedResponses && submittedResponses.length ? submittedResponses.length : 0;
    const maxAttemptCount = prompt && prompt.max_attempts ? prompt.max_attempts : MAX_ATTEMPTS;
    return(
      <div className="active-content-container">
        {this.renderEditorContainer()}
        <div className="attempts-and-button-container">
          <div className="attempts-container">
            <p className="number-of-attempts">{attemptsCount}</p>
            <p>{`of ${maxAttemptCount} attempts`}</p>
          </div>
          {this.renderFeedbackButtonAndDetails()}
        </div>
        {this.renderFeedbackSection()}
      </div>
    )
  }

  render() {
    const { className } = this.props

    return (
      <div className={className}>
        <div className="step-content">
          {this.renderActiveContent()}
        </div>
      </div>
    )
  }
}

export default PromptStep;
