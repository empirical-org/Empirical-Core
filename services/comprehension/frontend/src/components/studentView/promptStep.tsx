import * as React from 'react'

import EditorContainer from './editorContainer'
import Feedback from './feedback'
import EditCaretPositioning from '../../helpers/EditCaretPositioning'
import ButtonLoadingSpinner from '../shared/buttonLoadingSpinner'

interface PromptStepProps {
  active: Boolean;
  className: string,
  everyOtherStepCompleted: boolean;
  submitResponse: Function;
  completeStep: (event: any) => void;
  stepNumberComponent: JSX.Element,
  stepNumber: number;
  activateStep: (event: any) => void;
  prompt: any,
  passedRef: any,
  submittedResponses: Array<any>
}

interface PromptStepState {
  html: string;
  numberOfSubmissions: number;
  customFeedback: string|null;
  customFeedbackKey: string|null;
}

const RESPONSE = 'response'
const MINIMUM_WORD_COUNT = 3
const MAXIMUM_WORD_COUNT = 100

export const TOO_SHORT_FEEDBACK = "Whoops, it looks like you submitted your response before it was ready! Re-read what you wrote and finish the sentence provided."
export const TOO_LONG_FEEDBACK = "Revise your work so it is shorter and more concise."

export default class PromptStep extends React.Component<PromptStepProps, PromptStepState> {
  private editor: any // eslint-disable-line react/sort-comp

  constructor(props: PromptStepProps) {
    super(props)

    this.state = {
      html: this.formattedPrompt(),
      numberOfSubmissions: 0,
      customFeedback: null,
      customFeedbackKey: null
    };

    this.editor = React.createRef()
  }

  lastSubmittedResponse = () => {
    const { submittedResponses, } = this.props
    return submittedResponses.length ? submittedResponses[submittedResponses.length - 1] : {}
  }

  unsubmittableResponses = () => {
    const { submittedResponses, prompt } = this.props
    return submittedResponses.map(r => r.entry).concat(prompt.text)
  }

  stripHtml = (html: string) => html.replace(/<p>|<\/p>|<u>|<\/u>|<b>|<\/b>/g, '').replace(/&nbsp;/g, ' ')

  formattedPrompt = () => {
    const { prompt, } = this.props
    const { text, } = prompt
    return `<p>${this.allButLastWord(text)} <u>${this.lastWord(text)}</u>&nbsp;</p>`
  }

  textWithoutStem = (text: string) => {
    const formattedPrompt = this.formattedPrompt().replace(/<p>|<\/p>|<br>/g, '')
    const regex = new RegExp(`^${formattedPrompt}`)
    return text.replace(regex, '')
  }

  allButLastWord = (str: string) => str.substring(0, str.lastIndexOf(' '))

  lastWord = (str: string) => str.substring(str.lastIndexOf(' ') + 1)

  boldMisspellings = (str: string) => {
    const lastSubmittedResponse = this.lastSubmittedResponse()
    if (!(lastSubmittedResponse && lastSubmittedResponse.highlight && lastSubmittedResponse.highlight.filter(hl => hl.type === RESPONSE).length)) {
      return str
    }
    const misspelledWords = lastSubmittedResponse.highlight.filter(hl => hl.type === RESPONSE).map(hl => hl.text)
    const wordArray = this.stripHtml(str).split(' ')
    const newWordArray = wordArray.map(word => {
      const punctuationStrippedWord = word.replace(/[^A-Za-z0-9\s]/g, '')
      if (misspelledWords.includes(punctuationStrippedWord)) {
        return `<b>${word}</b>`
      } else {
        return word
      }
    })
    return newWordArray.join(' ')
  }

  onTextChange = (e) => {
    const { html, } = this.state
    const { value, } = e.target
    const text = value.replace(/<b>|<\/b>|<p>|<\/p>|<br>/g, '')
    const formattedPrompt = this.formattedPrompt().replace(/<p>|<\/p>|<br>/g, '')
    const regex = new RegExp(`^${formattedPrompt}`)
    if (text.match(regex)) {
      const caretPosition = EditCaretPositioning.saveSelection(this.editor)
      this.setState({ html: value, }, () => EditCaretPositioning.restoreSelection(this.editor, caretPosition))
      // if the student has deleted everything, we want to remove everything but the prompt stem
    } else if (!text.length) {
      this.resetText()
    } else {
      this.editor.innerHTML = html
    }

    this.setState({ customFeedback: null, customFeedbackKey: null })
  }

  resetText = () => {
    const html = this.formattedPrompt()
    this.setState({ html }, () => this.editor.innerHTML = html)
  }

  setEditorRef = (node: JSX.Element) => this.editor = node

  handleGetFeedbackClick = (entry: string, promptId: string, promptText: string) => {
    const { submitResponse, } = this.props

    const textWithoutStemArray = entry.replace(promptText, '').split(' ')

    if (textWithoutStemArray.length < MINIMUM_WORD_COUNT) {
      this.setState({ customFeedback: TOO_SHORT_FEEDBACK, customFeedbackKey: 'too-short', })
    } else if (textWithoutStemArray.length > MAXIMUM_WORD_COUNT) {
      this.setState({ customFeedback: TOO_LONG_FEEDBACK, customFeedbackKey: 'too-long' })
    } else {
      this.setState(prevState => ({numberOfSubmissions: prevState.numberOfSubmissions + 1}), () => {
        const { numberOfSubmissions, } = this.state
        submitResponse(entry, promptId, promptText, numberOfSubmissions)
      })
    }
  }

  handleStepInteraction = () => {
    const { activateStep, stepNumber, } = this.props

    activateStep(stepNumber)
  }

  completeStep = () => {
    const { completeStep, stepNumber, } = this.props

    completeStep(stepNumber)
  }

  renderButton = () => {
    const { prompt, submittedResponses, everyOtherStepCompleted, } = this.props
    const { html, numberOfSubmissions, } = this.state
    const entry = this.stripHtml(html).trim()
    const awaitingFeedback = numberOfSubmissions !== submittedResponses.length
    const buttonLoadingSpinner = awaitingFeedback ? <ButtonLoadingSpinner /> : null
    let buttonCopy = submittedResponses.length ? 'Get new feedback' : 'Get feedback'
    let className = 'quill-button'
    let onClick = () => this.handleGetFeedbackClick(entry, prompt.prompt_id, prompt.text)
    if (submittedResponses.length === prompt.max_attempts || this.lastSubmittedResponse().optimal) {
      onClick = this.completeStep
      buttonCopy = everyOtherStepCompleted ? 'Done' : 'Start next sentence'
    } else if (this.unsubmittableResponses().includes(entry) || awaitingFeedback) {
      className += ' disabled'
      onClick = () => {}
    }
    return <button className={className} onClick={onClick} type="button">{buttonLoadingSpinner}<span>{buttonCopy}</span></button>
  }

  renderFeedbackSection = () => {
    const { customFeedback, customFeedbackKey, } = this.state
    const { submittedResponses, prompt, } = this.props
    if (submittedResponses.length === 0 && !(customFeedback && customFeedbackKey)) { return }

    return (<Feedback
      customFeedback={customFeedback}
      customFeedbackKey={customFeedbackKey}
      lastSubmittedResponse={this.lastSubmittedResponse()}
      prompt={prompt}
      submittedResponses={submittedResponses}
    />)
  }

  renderEditorContainer = () => {
    const { html, } = this.state
    const { submittedResponses, prompt, } = this.props
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

    const text = html.replace(/<b>|<\/b>|<p>|<\/p>|<br>/g, '')
    const formattedPrompt = this.formattedPrompt().replace(/<p>|<\/p>|<br>/g, '')
    const regex = new RegExp(`^${formattedPrompt}`)
    const textWithoutStem = text.replace(regex, '')
    const spaceAtEnd = text.match(/\s$/m) ? '&nbsp;' : ''
    const htmlWithBolding = `<p>${formattedPrompt}${this.boldMisspellings(textWithoutStem)}${spaceAtEnd}</p>`

    return (<EditorContainer
      className={className}
      disabled={disabled}
      handleTextChange={this.onTextChange}
      html={htmlWithBolding}
      innerRef={this.setEditorRef}
      promptText={prompt.text}
      resetText={this.resetText}
      stripHtml={this.stripHtml}
    />)
  }

  renderActiveContent = () => {
    const { active, } = this.props
    if (!active) { return }

    return (<div className="active-content-container">
      {this.renderEditorContainer()}
      {this.renderButton()}
      {this.renderFeedbackSection()}
    </div>)
  }

  render() {
    const { prompt, className, passedRef, stepNumberComponent, } = this.props
    const { text, } = prompt
    const promptTextComponent = <p className="prompt-text">{this.allButLastWord(text)} <span>{this.lastWord(text)}</span></p>
    return (<div className={className} onClick={this.handleStepInteraction} onKeyDown={this.handleStepInteraction} ref={passedRef} role="button" tabIndex={0}>
      <div className="step-content">
        <div className="step-header">
          {stepNumberComponent}
          <p className="directions">Use information from the text to finish the sentence:</p>
        </div>
        {promptTextComponent}
        {this.renderActiveContent()}
      </div>
    </div>)
  }
}
