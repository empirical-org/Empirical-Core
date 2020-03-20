import React, { Component } from 'react';
import { connect } from 'react-redux';
import fillInBlankActions from '../../actions/fillInBlank.js';
import FillInBlankForm from './fillInBlankForm.jsx';

class EditFillInBlank extends Component {
  constructor() {
    super();
    this.state = {};
  }

  editQuestion = data => {
    const { dispatch, params } = this.props;
    const { questionID } = params;
    const { fillInBlankQuestionID } = questionID;
    const questionData = data;
    questionData.prompt = data.prompt.replace('<p>', '').replace('</p>', '')
    dispatch(fillInBlankActions.submitQuestionEdit(fillInBlankQuestionID, data));
  };

  returnQuestionState = () => {
    const { fillInBlank, params } = this.props;
    const { questionID } = params;
    const { data } = fillInBlank;
    const fillInBlankQuestionID = questionID;
    const fillInBlankQuestion = data[fillInBlankQuestionID];
    const { prompt, blankAllowed, caseInsensitive, instructions, cues, itemLevel, conceptID, flag, cuesLabel } = fillInBlankQuestion;
    return {
      prompt,
      blankAllowed,
      caseInsensitive,
      instructions,
      cues: cues.join(','),
      itemLevel,
      conceptID,
      flag,
      cuesLabel
    };
  };

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
