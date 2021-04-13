import * as React from 'react'

import EditorContainer from './editorContainer'
import Feedback from './feedback'

import EditCaretPositioning from '../../helpers/EditCaretPositioning'
import ButtonLoadingSpinner from '../shared/buttonLoadingSpinner'
import preFilters from '../../modules/prefilters'

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

export class PromptStep extends React.Component<PromptStepProps, PromptStepState> {
  private editor: any // eslint-disable-line react/sort-comp

  constructor(props: PromptStepProps) {
    super(props)

    const { submittedResponses, } = this.props

    this.state = {
      html: this.formattedPrompt(submittedResponses),
      numberOfSubmissions: submittedResponses.length,
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

  formatStudentResponse = (str: string) => {
    const lastSubmittedResponse = this.lastSubmittedResponse()
    if (!(lastSubmittedResponse && lastSubmittedResponse.highlight && lastSubmittedResponse.highlight.filter(hl => hl.type === RESPONSE).length)) {
      return str
    }
    let wordsToFormat = lastSubmittedResponse.highlight.filter(hl => hl.type === RESPONSE).map(hl => hl.text)
    wordsToFormat = wordsToFormat.length === 1 ? wordsToFormat[0] : wordsToFormat
    if (lastSubmittedResponse.feedback_type == 'plagiarism') {
      return this.formatPlagiarismHighlight(str, wordsToFormat)
    } else {
      return this.formatSpellingGrammarHighlight(str, wordsToFormat)
    }
  }

  formatPlagiarismHighlight = (str: string, wordsToFormat: string) => {
    let boldedString = `<b>${wordsToFormat}</b>`
    return str.replace(wordsToFormat, boldedString)
  }

  formatSpellingGrammarHighlight = (str: string, wordsToFormat: string | string[]) => {
    let wordArray = [].concat(wordsToFormat)
    let newString = str
    wordArray.forEach((word) => {
      newString = newString.replace(word, `<b>${word}</b>`)
    })
    return newString
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
    const { html, } = this.state
    const { value, } = e.target
    const text = value.replace(/<b>|<\/b>|<p>|<\/p>|<br>/g, '')
    const regex = this.promptAsRegex()
    const caretPosition = EditCaretPositioning.saveSelection(this.editor)
    if (text.match(regex)) {
      this.setState({ html: value, }, () => EditCaretPositioning.restoreSelection(this.editor, caretPosition))
      // if the student has deleted everything, we want to remove everything but the prompt stem
    } else if (!text.length) {
      this.resetText()
    } else {
      const splitSubmission = text.split('&nbsp;')

      // handles case where change is only in the formatted prompt part
      if (splitSubmission.length > 1) {
        const newValue = `${this.htmlStrippedPrompt()}${splitSubmission[1]}`
        this.setState({ html: newValue}, () => {
          this.editor.innerHTML = newValue
        })
      // student overwrote or deleted both part of their submission and the formatted prompt and the solution is much more complicated
      } else {
        const formattedPromptWordArray = this.htmlStrippedPrompt().split(' ')
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
          const diffWordWithoutHtmlLettersArray = textWordArray[originalIndex] ? this.stripHtml(textWordArray[originalIndex]).split('') : null
          if (diffWordWithoutHtmlLettersArray) {
            const diffWordEquivalentWithoutHtmlLettersArray = this.stripHtml(diffWordEquivalent)
            const indexOfLettersToKeepFromDiffWord = diffWordWithoutHtmlLettersArray.findIndex((letter: string, i: number) => letter !== diffWordEquivalentWithoutHtmlLettersArray[i])
            const partOfDiffWordToKeep = diffWordWithoutHtmlLettersArray.slice(indexOfLettersToKeepFromDiffWord).join('').replace(/(&nbsp;)|(<u>)|(<\/u>)/g, '')
            // keeping track of what they'd modified it to be, so we don't lose those changes
            textToAddAfterPromptText.push(partOfDiffWordToKeep)
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

  handleGetFeedbackClick = (entry: string, promptId: string, promptText: string) => {
    const { submitResponse, } = this.props

    const textWithoutStem = entry.replace(promptText, '')

    const prefilter = preFilters(textWithoutStem)

    if (prefilter) {
      this.setState({ customFeedback: prefilter.feedback, customFeedbackKey: prefilter.feedbackKey, })
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

  formatHtmlForEditorContainer = (html: string, active: boolean) => {
    const { prompt, } = this.props
    const text = html.replace(/<b>|<\/b>|<p>|<\/p>|<br>|<u>|<\/u>/g, '').replace('&nbsp;', '')
    const textWithoutStem = text.replace(prompt.text, '').trim()
    const spaceAtEnd = text.match(/\s$/m) ? '&nbsp;' : ''
    return {
      htmlWithBolding: active ? `<p>${this.htmlStrippedPrompt()}${this.formatStudentResponse(textWithoutStem)}${spaceAtEnd}</p>` : `<p>${textWithoutStem}</p>`,
      rawTextWithoutStem: textWithoutStem
    }
  }

  renderButton = () => {
    const { prompt, submittedResponses, everyOtherStepCompleted, } = this.props
    const { id, text, max_attempts } = prompt
    const { html, numberOfSubmissions, } = this.state
    const entry = this.stripHtml(html).trim()
    const awaitingFeedback = numberOfSubmissions !== submittedResponses.length
    const buttonLoadingSpinner = awaitingFeedback ? <ButtonLoadingSpinner /> : null
    let buttonCopy = submittedResponses.length ? 'Get new feedback' : 'Get feedback'
    let className = 'quill-button'
    let onClick = () => this.handleGetFeedbackClick(entry, id, text)
    if (submittedResponses.length === max_attempts || this.lastSubmittedResponse().optimal) {
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
    const { submittedResponses, prompt, active, } = this.props
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

    const formattedText = this.formatHtmlForEditorContainer(html, active)

    return (<EditorContainer
      className={className}
      disabled={disabled}
      handleTextChange={this.onTextChange}
      html={formattedText.htmlWithBolding}
      innerRef={this.setEditorRef}
      isResettable={!!formattedText.rawTextWithoutStem.length}
      promptText={prompt.text}
      resetText={this.resetText}
      stripHtml={this.stripHtml}
    />)
  }

  renderActiveContent = () => {
    const { active, prompt, stepNumberComponent, submittedResponses, } = this.props
    const { text } = prompt

    if (!active) {
      const promptTextComponent = <p className="prompt-text">{this.allButLastWord(text)} <span>{this.lastWord(text)}</span></p>
      const lastSubmittedResponse = this.lastSubmittedResponse()
      const outOfAttempts = submittedResponses.length === prompt.max_attempts
      const editor = lastSubmittedResponse.optimal || outOfAttempts ? this.renderEditorContainer() : null
      const fadedRectangle = editor ? <div className="faded-rectangle" /> : null
      return (
        <div>
          <div className="step-header">
            {stepNumberComponent}
            {promptTextComponent}
          </div>
          {editor}
          {fadedRectangle}
        </div>
      )
    }

    return (<div>
      <div className="step-header">
        {stepNumberComponent}
        <p className="directions">Use information from the text to finish the sentence:</p>
      </div>
      <div className="active-content-container">
        {this.renderEditorContainer()}
        {this.renderButton()}
        {this.renderFeedbackSection()}
      </div>
    </div>)
  }

  render() {
    const { className, passedRef, } = this.props
    return (<div className={className} onClick={this.handleStepInteraction} onKeyDown={this.handleStepInteraction} ref={passedRef} role="button" tabIndex={0}>
      <div className="step-content">
        {this.renderActiveContent()}
      </div>
    </div>)
  }
}

export default PromptStep
