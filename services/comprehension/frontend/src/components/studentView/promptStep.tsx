import * as React from 'react'
import ContentEditable from 'react-contenteditable'

interface PromptStepProps {
 className: string,
 stepNumberComponent: JSX.Element,
 text: string,
 passedRef: any,
}

export default class PromptStep extends React.Component<PromptStepProps, any> {
  private editor

  constructor(props: PromptStepProps) {
    super(props)

    this.state = { html: this.formattedPrompt() };
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
      this.setState({ html, })
    }
  }

  render() {
    const { text, className, passedRef, stepNumberComponent, } = this.props
    const promptTextComponent = <p className="prompt-text">{this.allButLastWord(text)} <span>{this.lastWord(text)}</span></p>
    return (<div className={className} ref={passedRef}>
      {stepNumberComponent}
      <div className="step-content">
        <p className="directions">Use information from the text to finish the sentence:</p>
        {promptTextComponent}
        <ContentEditable
          innerRef={(node: JSX.Element) => this.editor = node}
          html={this.state.html}
          onChange={this.handleTextChange}
          spellCheck={false}
        />
      </div>
    </div>)
  }
}
