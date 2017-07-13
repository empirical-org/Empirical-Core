import React, { Component } from 'react';

class SubmitButton extends Component<{data: QuestionData}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="question-button-group">
        <button disabled={this.props.submittable} onClick={this.props.onclick} className="button student-submit">Submit</button>
      </div>);
    );
  }

}

export default SubmitButton;
