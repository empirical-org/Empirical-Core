import React, { Component } from 'react';
import { connect } from 'react-redux';
import fillInBlankActions from '../../actions/fillInBlank';
import FillInBlankForm from './fillInBlankForm.jsx';

class EditFillInBlank extends Component {

  editQuestion = data => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    const questionData = data;
    dispatch(fillInBlankActions.submitQuestionEdit(questionID, data));
  };

  returnQuestionState = () => {
    const { fillInBlank, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    const { data } = fillInBlank;
    const fillInBlankQuestionID = questionID;
    const fillInBlankQuestion = data[fillInBlankQuestionID];
    const { prompt, blankAllowed, caseInsensitive, instructions, cues, conceptID, flag, cuesLabel } = fillInBlankQuestion;
    return {
      prompt,
      blankAllowed,
      caseInsensitive,
      instructions,
      cues: cues.join(','),
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
