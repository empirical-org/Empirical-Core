import * as React from 'react';
import Textarea from 'react-textarea-autosize';

interface TextEditorProps {
  value?: string;
  hasError?: boolean;
  disabled?: boolean;
  index: string|number;
  handleChange: Function;
  placeholder?: string;
}

interface TextEditorState {
  text: string
}

class TextEditor extends React.Component<TextEditorProps, TextEditorState> {
  constructor(props) {
    super(props)

    this.state = {text: props.value || ''}
    this.handleTextChange = this.handleTextChange.bind(this)
  }

  handleTextChange(e) {
    if (!this.props.disabled) {
      this.props.handleChange(e.target.value, this.props.index);
    } else {
      console.log("I'm disable RN");
    }
  }

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
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TextEditor
