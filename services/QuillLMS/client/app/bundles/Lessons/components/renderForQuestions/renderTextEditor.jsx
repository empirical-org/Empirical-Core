import React from 'react';
import Textarea from 'react-textarea-autosize';
const C = require('../../constants').default;

const noUnderlineErrors = [];

const feedbackStrings = C.FEEDBACK_STRINGS;

export default class RenderTextEditor extends React.Component {
  handleTextChange = (e) => {
    const { disabled, handleChange, editorIndex, } = this.props
    if (!disabled) {
      handleChange(e.target.value, editorIndex);
    }
  };

  handleKeyDown = (e) => {
    const { disabled, checkAnswer, } = this.props
    if (!disabled) {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkAnswer();
      }
    }
  };

  render() {
    const { disabled, placeholder, spellCheck, value, } = this.props
    const disabledClassName = disabled ? 'disabled-editor' : null
    return (
      <Textarea
        autoCapitalize="off"
        autoCorrect="off"
        className={`student text-editor card is-fullwidth ${disabledClassName}`}
        disabled={disabled}
        onInput={this.handleTextChange}
        onKeyDown={this.handleKeyDown}
        placeholder={placeholder}
        ref="answerBox"
        spellCheck={spellCheck || false}
        value={value}
      />
    );
  }
}
