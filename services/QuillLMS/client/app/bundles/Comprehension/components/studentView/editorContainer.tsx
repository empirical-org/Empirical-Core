import * as React from 'react'
import ContentEditable from 'react-contenteditable'

const enabledClearSrc =  `${process.env.CDN_URL}/images/icons/clear-enabled.svg`
const disabledClearSrc =  `${process.env.CDN_URL}/images/icons/clear-disabled.svg`


interface EditorContainerProps {
  promptText: string;
  stripHtml: (input: string) => input;
  html: string;
  disabled: boolean;
  resetText: (event: any) => void;
  innerRef: Function;
  handleTextChange: (event: any) => void;
  className: string;
  isResettable: boolean;
}

export default class EditorContainer extends React.Component<EditorContainerProps, any> {
  componentDidMount() {
    window.addEventListener('paste', (e) => {
      e.preventDefault()
      return false
    }, true);
  }

  renderClear = () => {
    const { disabled, resetText, isResettable, } = this.props
    if (disabled) { return }

    if (isResettable) {
      return (<button className="clear-button" onClick={resetText} type="button">
        <img
          alt="circle with an x in it"
          className="clear"
          src={enabledClearSrc}
        />
        Clear response
      </button>)
    }

    return (<button className="disabled clear-button" type="button">
      <img
        alt="circle with an x in it"
        className="clear"
        src={disabledClearSrc}
      />
      Clear response
    </button>)
  }

  render() {
    const { disabled, html, innerRef, handleTextChange, className, } = this.props
    return (<div className="editor-container">
      <ContentEditable
        className={className}
        data-gramm={false}
        disabled={disabled}
        html={html}
        innerRef={innerRef}
        onChange={handleTextChange}
        spellCheck={false}
      />
      {this.renderClear()}
    </div>)
  }
}
