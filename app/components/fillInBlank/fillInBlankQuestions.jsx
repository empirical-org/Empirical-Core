import React, { Component } from 'react';
import { connect } from 'react-redux';

class FillInBlankQuestions extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
fillInBlankQuestion.jsx
      </div>
    );
  }

}

function select(props) {
  return {
    fillInBlank: props.fillInBlank,
  };
}

export default connect(select)(FillInBlankQuestions);
