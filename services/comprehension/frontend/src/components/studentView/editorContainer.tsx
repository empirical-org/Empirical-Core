import * as React from 'react'
import ContentEditable from 'react-contenteditable'

const clearSrc =  `${process.env.QUILL_CDN_URL}/images/icons/clear.svg`

export default class EditorContainer extends React.Component<any, any> {
  componentDidMount() {
    window.addEventListener('paste', (e) => {
      e.preventDefault()
      return false
    }, true);
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    // this prevents some weird cursor stuff from happening in the text editor
    const { unsubmittableResponses, stripHtml, html, disabled } = nextProps
    if (disabled) return true

    // this prevents some weird cursor stuff from happening in the text editor
    const firstEditHasAlreadyBeenMade = !unsubmittableResponses.includes(stripHtml(html))
    if (firstEditHasAlreadyBeenMade) return false

    return true
  }

  renderClear = () => {
    const { disabled, resetText, } = this.props
    if (disabled) return
    return (<img
      alt="circle with an x in it"
      className="clear"
      onClick={resetText}
      src={clearSrc}
    />)
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
