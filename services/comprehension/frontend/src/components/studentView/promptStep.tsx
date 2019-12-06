import * as React from 'react'
import ContentEditable from 'react-contenteditable'

const clearSrc =  `${process.env.QUILL_CDN_URL}/images/icons/clear.svg`

interface PromptStepProps {
  active: Boolean;
  className: string,
  stepNumberComponent: JSX.Element,
  text: string,
  passedRef: any,
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
    const textHasChanged = this.state.html !== nextState.html
    const textHasNotBeenReset = nextState.html !== this.formattedPrompt()
    if (textHasChanged && textHasNotBeenReset) return false
    return true
  }


  formattedPrompt = () => {
    const { text, } = this.props
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
      this.setState({ html, }, () => { this.editor.blur() })
    }
  }

  resetText = () => {
    this.setState({ html: this.formattedPrompt() })
  }

  renderEditorAndButton = () => {
    if (!this.props.active) return
    return (<div className="editor-and-button-container">
      <div className="editor-container">
        <ContentEditable
          className="editor"
          innerRef={(node: JSX.Element) => this.editor = node}
          html={this.state.html}
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
    </div>)
  }

  render() {
    const { text, className, passedRef, stepNumberComponent, } = this.props
    const promptTextComponent = <p className="prompt-text">{this.allButLastWord(text)} <span>{this.lastWord(text)}</span></p>
    return (<div className={className} ref={passedRef}>
      {stepNumberComponent}
      <div className="step-content">
        <p className="directions">Use information from the text to finish the sentence:</p>
        {promptTextComponent}
        {this.renderEditorAndButton()}
      </div>
    </div>)
  }
}
