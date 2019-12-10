import * as React from 'react'
import ContentEditable from 'react-contenteditable'

const clearSrc =  `${process.env.QUILL_CDN_URL}/images/icons/clear.svg`

export default class EditorContainer extends React.Component<any, any> {
  shouldComponentUpdate(nextProps: any, nextState: any) {
    // this prevents some weird cursor stuff from happening in the text editor
    const { unsubmittableResponses, stripHtml, html, } = nextProps
    const firstEditHasAlreadyBeenMade = !unsubmittableResponses.includes(stripHtml(html))
    if (firstEditHasAlreadyBeenMade) return false

    return true
  }

  render() {
    const { html, innerRef, handleTextChange, resetText, className, } = this.props
    return (<div className="editor-container">
      <ContentEditable
        className={className}
        html={html}
        innerRef={innerRef}
        onChange={handleTextChange}
        spellCheck={false}
      />
      <img
        alt="circle with an x in it"
        className="clear"
        onClick={resetText}
        src={clearSrc}
      />
    </div>)
  }
}
