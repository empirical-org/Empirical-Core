import * as React from 'react'
import { Editor, EditorState, ContentState, convertToRaw } from 'draft-js';
import { convertFromHTML, convertToHTML } from 'draft-convert'


interface PromptStepProps {
 className: string,
 stepNumberComponent: JSX.Element,
 text: string,
 passedRef: any,
}

export default class PromptStep extends React.Component<PromptStepProps, any> {
  constructor(props: PromptStepProps) {
    super(props)

    this.state = {
      text: EditorState.createWithContent(convertFromHTML(this.formattedPrompt() || '')),
      hasFocus: false
    }
  }

  formattedPrompt = () => {
    const { text, } = this.props
    return `<p>${this.allButLastWord(text)} <u>${this.lastWord(text)}</u> </p>`
  }

  allButLastWord = (str: string) => str.substring(0, str.lastIndexOf(' '))

  lastWord = (str: string) => str.split(' ').splice(-1)

  handleTextChange = (e) => {
    const text = convertToHTML(e.getCurrentContent()).replace(/<p>|<\p>/, '')
    const formattedPrompt = this.formattedPrompt().replace(/<p>|<\p>/, '')
    const regex = new RegExp(`^${formattedPrompt}`)
    if (text.match(regex)) {
      this.setState({ text: e, })
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
        <Editor
          editorState={this.state.text}
          onBlur={() => this.setState({ hasFocus: false, })}
          onChange={this.handleTextChange}
          onFocus={() => this.setState({ hasFocus: true, })}
        />
      </div>
    </div>)
  }
}
