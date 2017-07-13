import React, { Component } from 'react';

class SubmitButton extends Component<{data: QuestionData}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="question-button-group">
        <button
          className={`button student-submit ${this.props.disabled ? 'disabled' : null}`}
          onClick={this.props.onClick}>
            Submit
          </button>
      </div>);
    );
  }

}

export default SubmitButton;
