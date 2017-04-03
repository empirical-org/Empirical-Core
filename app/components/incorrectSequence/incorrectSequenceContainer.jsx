import React, { Component } from 'react';
import { connect } from 'react-redux';

class IncorrectSequencesContainer extends Component {
  constructor() {
    super();
  }

  getQuestion() {
    return this.props.questions.data[this.props.params.questionID];
  }

  render() {
    console.log(this.getQuestion());
    return (
      <div>
        Incorrect Sequences
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions,
  };
}

export default connect(select)(IncorrectSequencesContainer);
