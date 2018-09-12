import React, { Component } from 'react';
import { connect } from 'react-redux';
import fillInBlankActions from '../../actions/fillInBlank.js';
import FillInBlankForm from './fillInBlankForm.jsx';

class EditFillInBlank extends Component {
  constructor() {
    super();
    this.state = {};
    this.editQuestion = this.editQuestion.bind(this);
    this.returnQuestionState = this.returnQuestionState.bind(this);
  }

  editQuestion(data) {
    const fillInBlankQuestionID = this.props.params.questionID;
    const questionData = data
    questionData.prompt = data.prompt.replace('<p>', '').replace('</p>', '')
    this.props.dispatch(fillInBlankActions.submitQuestionEdit(fillInBlankQuestionID, data));
  }

  returnQuestionState() {
    const fillInBlankQuestionID = this.props.params.questionID;
    const fillInBlankQuestion = this.props.fillInBlank.data[fillInBlankQuestionID];
    return {
      prompt: fillInBlankQuestion.prompt,
      blankAllowed: fillInBlankQuestion.blankAllowed,
      instructions: fillInBlankQuestion.instructions,
      cues: fillInBlankQuestion.cues.join(','),
      itemLevel: fillInBlankQuestion.itemLevel,
      conceptID: fillInBlankQuestion.conceptID,
      flag: fillInBlankQuestion.flag,
      cuesLabel: fillInBlankQuestion.cuesLabel
    };
  }

  render() {
    return <FillInBlankForm action={this.editQuestion} editing={true} state={this.returnQuestionState()} />;
  }
}

function select(state) {
  return {
    fillInBlank: state.fillInBlank
  };
}

export default connect(select)(EditFillInBlank);
