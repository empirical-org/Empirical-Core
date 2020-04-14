import React, { Component } from 'react';
import { connect } from 'react-redux';
import fillInBlankActions from '../../actions/fillInBlank';
import FillInBlankForm from './fillInBlankForm.jsx';

class EditFillInBlank extends Component {
  constructor() {
    super();
    this.state = {};
  }

  editQuestion = data => {
    const fillInBlankQuestionID = this.props.params.questionID;
    const questionData = data
    questionData.prompt = data.prompt.replace('<p>', '').replace('</p>', '')
    this.props.dispatch(fillInBlankActions.submitQuestionEdit(fillInBlankQuestionID, data));
  };

  returnQuestionState = () => {
    const fillInBlankQuestionID = this.props.params.questionID;
    const fillInBlankQuestion = this.props.fillInBlank.data[fillInBlankQuestionID];
    return {
      questionID: fillInBlankQuestionID,
      prompt: fillInBlankQuestion.prompt,
      blankAllowed: fillInBlankQuestion.blankAllowed,
      caseInsensitive: fillInBlankQuestion.caseInsensitive,
      instructions: fillInBlankQuestion.instructions,
      cues: fillInBlankQuestion.cues.join(','),
      itemLevel: fillInBlankQuestion.itemLevel,
      conceptID: fillInBlankQuestion.conceptID,
      flag: fillInBlankQuestion.flag,
      cuesLabel: fillInBlankQuestion.cuesLabel
    };
  };

  render() {
    const questionData = this.returnQuestionState()
    const { prompt, blankAllowed, caseInsensitive, instructions, cues, conceptID, flag, cuesLabel, questionID } = questionData
    return(
      <FillInBlankForm
        action={this.editQuestion} 
        blankAllowed={blankAllowed}
        caseInsensitive={caseInsensitive}
        conceptID={conceptID}
        cues={cues}
        cuesLabel={cuesLabel}
        editing={true}  
        flag={flag}
        instructions={instructions}
        prompt={prompt}
        questionID={questionID}
      />
    );
  }
}

function select(state) {
  return {
    fillInBlank: state.fillInBlank
  };
}

export default connect(select)(EditFillInBlank);
