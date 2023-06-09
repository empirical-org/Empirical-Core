import * as React from 'react';
import ContentEditable from 'react-contenteditable';

const enabledClearSrc =  `${process.env.CDN_URL}/images/icons/clear-enabled.svg`
const disabledClearSrc =  `${process.env.CDN_URL}/images/icons/clear-disabled.svg`


interface EditorContainerProps {
  promptText: string;
  stripHtml: (input: string) => any;
  html: string;
  disabled: boolean;
  handleFocus: (event: any) => void;
  handleKeyDown: (event: any) => void;
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

  render() {
    const { disabled, html, innerRef, handleTextChange, className, handleFocus, handleKeyDown } = this.props
    return (
      <div className="editor-container">
        <ContentEditable
          className={className}
          data-gramm={false}
          disabled={disabled}
          html={html}
          innerRef={innerRef}
          onChange={handleTextChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          spellCheck={true}
        />
      </div>
    )
  }
}
