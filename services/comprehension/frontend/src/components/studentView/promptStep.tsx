import * as React from 'react'

import EditorContainer from './editorContainer'

const loopSrc = `${process.env.QUILL_CDN_URL}/images/icons/loop.svg`
const smallCheckCircleSrc = `${process.env.QUILL_CDN_URL}/images/icons/check-circle-small.svg`

interface PromptStepProps {
  active: Boolean;
  className: string,
  submitResponse: Function;
  stepNumberComponent: JSX.Element,
  onClick?: (event: any) => void;
  prompt: any,
  passedRef: any,
  submittedResponses: Array<any>
}

interface PromptStepState {
  html: string;
}

export default class PromptStep extends React.Component<PromptStepProps, PromptStepState> {
  private editor: any // eslint-disable-line react/sort-comp

  constructor(props: PromptStepProps) {
    super(props)

    this.state = { html: this.formattedPrompt() };
  }

  unsubmittableResponses = () => {
    const { submittedResponses, prompt } = this.props
    return submittedResponses.map(r => r.entry).concat(prompt.text)
  }

  stripHtml = (html: string) => html.replace(/<p>|<\/p>|<u>|<\/u>/g, '').replace('&nbsp;', ' ')

  formattedPrompt = () => {
    const { text, } = this.props.prompt
    return `<p>${this.allButLastWord(text)} <u>${this.lastWord(text)}</u>&nbsp;</p>`
  }

  allButLastWord = (str: string) => str.substring(0, str.lastIndexOf(' '))

  lastWord = (str: string) => str.split(' ').splice(-1)

  handleTextChange = (e) => {
    console.log('is this app')
    const { html, } = this.state
    const { value, } = e.target
    const text = value.replace(/<p>|<\/p>/g, '')
    const formattedPrompt = this.formattedPrompt().replace(/<p>|<\/p>/g, '')
    const regex = new RegExp(`^${formattedPrompt}`)
    if (text.match(regex)) {
      this.setState({ html: value, })
    } else {
      this.editor.innerHTML = html
    }
  }

  resetText = () => {
    const html = this.formattedPrompt()
    this.setState({ html }, () => this.editor.innerHTML = html)
  }

  renderButton = () => {
    const { prompt, submitResponse, submittedResponses, } = this.props
    const { html, } = this.state
    const entry = this.stripHtml(html).trim()
    const buttonCopy = submittedResponses.length ? 'Get new feedback' : 'Get feedback'
    let className = ''
    let onClick = () => submitResponse(entry, prompt.prompt_id)
    console.log('this.unsubmittableResponses()', this.unsubmittableResponses())
    console.log('entry', entry)
    if (this.unsubmittableResponses().includes(entry)) {
      className = 'disabled'
      onClick = () => {}
    }
    return <button className={className} onClick={onClick}>{buttonCopy}</button>
  }

  renderFeedbackSection = () => {
    const { submittedResponses, prompt, } = this.props
    if (submittedResponses.length === 0) return
    const lastSubmittedResponse = submittedResponses.slice(-1)[0]
    let className = 'feedback'
    let imageSrc = loopSrc
    let imageAlt = 'Arrows pointing in opposite directions, making a loop'
    if (lastSubmittedResponse.optimal) {
      className += ' optimal'
      imageSrc = smallCheckCircleSrc
      imageAlt = 'Small green circle with a check in it'
    }
    return (<div className="feedback-section">
      <p className="feedback-section-header">
        Feedback<span>{submittedResponses.length} of {prompt.max_attempts} attempts</span>
      </p>
      <div className={className}>
        <img alt={imageAlt} src={imageSrc} />
        <p>{lastSubmittedResponse.feedback}</p>
      </div>
    </div>)
  }

  renderEditorContainer = () => {
    const { submittedResponses, } = this.props
    let className = 'editor'
    if (submittedResponses.length) {
      const lastSubmittedResponse = submittedResponses.slice(-1)[0]
      className += lastSubmittedResponse.optimal ? ' optimal' : ' suboptimal'
    }
    return (<EditorContainer
      className={className}
      handleTextChange={this.handleTextChange}
      html={this.state.html}
      innerRef={(node: JSX.Element) => this.editor = node}
      resetText={this.resetText}
      stripHtml={this.stripHtml}
      unsubmittableResponses={this.unsubmittableResponses()}
    />)
  }

  renderActiveContent = () => {
    if (!this.props.active) return
    return (<div className="active-content-container">
      {this.renderEditorContainer()}
      {this.renderButton()}
      {this.renderFeedbackSection()}
    </div>)
  }

  render() {
    const { prompt, className, passedRef, stepNumberComponent, onClick, } = this.props
    const { text, } = prompt
    const promptTextComponent = <p className="prompt-text">{this.allButLastWord(text)} <span>{this.lastWord(text)}</span></p>
    return (<div className={className} onClick={onClick} ref={passedRef}>
      {stepNumberComponent}
      <div className="step-content">
        <p className="directions">Use information from the text to finish the sentence:</p>
        {promptTextComponent}
        {this.renderActiveContent()}
      </div>
    </div>)
  }
}
