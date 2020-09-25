import React, { Component } from 'react';
import { connect } from 'react-redux';

import FillInBlankForm from './fillInBlankForm.jsx';

import fillInBlankActions from '../../actions/fillInBlank';

class NewFillInBlank extends Component {
  submitNewQuestion = (data, newQuestionOptimalResponse) => {
    const { dispatch } = this.props;
    if (data.prompt !== '') {
      const questionData = data
      questionData.prompt = data.prompt.replace('<p>', '').replace('</p>', '')
      dispatch(fillInBlankActions.submitNewQuestion(
        questionData,
        {
          text: newQuestionOptimalResponse.trim(),
          optimal: true,
          count: 0,
          feedback: "That's a strong sentence!"
        }
      ));
    }
  };

  render() {
    return <FillInBlankForm action={this.submitNewQuestion} />;
  }
}

function select(state) {
  return {};
}

export default connect(select)(NewFillInBlank);
