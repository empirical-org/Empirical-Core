import React from 'react';
import _ from 'underscore';
import Textarea from 'react-textarea-autosize';

export default React.createClass({
  getInitialState() {
    return {
      text: this.props.value || '',
    };
  },

  handleTextChange(e) {
    if (!this.props.disabled) {
      this.props.handleChange(e.target.value, this.props.editorIndex);
    } else {
      console.log("I'm disable RN");
    }
  },

  render() {
    return (
      <div className={`student text-editor card is-fullwidth ${this.props.hasError ? 'red-outline' : ''} ${this.props.disabled ? 'disabled-editor' : ''}`}>
        <div className="card-content">
          <div className="content">
            <Textarea
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              value={this.props.value}
              onInput={this.handleTextChange}
              placeholder={this.props.placeholder}
              ref="answerBox"
              className="connect-text-area"
              autoFocus={false}
            />
          </div>
        </div>
      </div>
    );
  },
});
