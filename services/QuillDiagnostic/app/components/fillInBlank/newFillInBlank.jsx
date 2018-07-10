import React, { Component } from 'react';
import { connect } from 'react-redux';
import fillInBlankActions from '../../actions/fillInBlank.js';
import FillInBlankForm from './fillInBlankForm.jsx';

class NewFillInBlank extends Component {
  constructor() {
    super();
    this.submitNewQuestion = this.submitNewQuestion.bind(this);
  }

  submitNewQuestion(data, newQuestionOptimalResponse) {
    if (data.prompt !== '') {
      const questionData = data
      questionData.prompt = data.prompt.replace('<p>', '').replace('</p>', '')
      this.props.dispatch(fillInBlankActions.submitNewQuestion(
        questionData,
        {
          text: newQuestionOptimalResponse.trim(),
          optimal: true,
          count: 0,
          feedback: "That's a great sentence!"
        }
      ));
    }
  }

  render() {
    return <FillInBlankForm action={this.submitNewQuestion} />;
  }
}

function select(state) {
  return {};
}

export default connect(select)(NewFillInBlank);
