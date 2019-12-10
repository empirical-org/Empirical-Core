import * as React from 'react'
import ContentEditable from 'react-contenteditable'

const clearSrc =  `${process.env.QUILL_CDN_URL}/images/icons/clear.svg`

interface PromptStepProps {
  active: Boolean;
  className: string,
  getFeedback: Function;
  stepNumberComponent: JSX.Element,
  onClick?: (event: any) => void;
  prompt: any,
  passedRef: any,
  responses: Array<any>
}

interface PromptStepState {
  html: string;
}

export default class PromptStep extends React.Component<PromptStepProps, PrompStepState> {
  private editor: any // eslint-disable-line react/sort-comp

  constructor(props: PromptStepProps) {
    super(props)

    this.state = { html: this.formattedPrompt() };
  }

  shouldComponentUpdate(nextProps: PromptStepProps, nextState: PromptStepState) {
    // this prevents some weird cursor stuff from happening in the text editor
    const textHasNotBeenReset = nextState.html !== this.formattedPrompt()
    const firstEditHasAlreadyBeenMade = this.state.html !== this.formattedPrompt()
    if (textHasNotBeenReset && firstEditHasAlreadyBeenMade) return false
    return true
  }

  formattedPrompt = () => {
    const { text, } = this.props.prompt
    return `<p>${this.allButLastWord(text)} <u>${this.lastWord(text)}</u>&nbsp;</p>`
  }

  allButLastWord = (str: string) => str.substring(0, str.lastIndexOf(' '))

  lastWord = (str: string) => str.split(' ').splice(-1)

  handleTextChange = (e) => {
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
    this.setState({ html: this.formattedPrompt() })
  }

  renderButton = () => {
    const { html, } = this.state
    let className = ''
    let onClick = this.props.getFeedback
    if (html === this.formattedPrompt()) {
      className = 'disabled'
      onClick = null
    }
    return <button className={className} onClick={onClick}>Get feedback</button>
  }

  renderEditorAndButton = () => {
    if (!this.props.active) return
    return (<div className="editor-and-button-container">
      <div className="editor-container">
        <ContentEditable
          className="editor"
          html={this.state.html}
          innerRef={(node: JSX.Element) => this.editor = node}
          onChange={this.handleTextChange}
          spellCheck={false}
        />
        <img
          alt="circle with an x in it"
          className="clear"
          onClick={this.resetText}
          src={clearSrc}
        />
      </div>
      {this.renderButton()}
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
        {this.renderEditorAndButton()}
      </div>
    </div>)
  }
}
