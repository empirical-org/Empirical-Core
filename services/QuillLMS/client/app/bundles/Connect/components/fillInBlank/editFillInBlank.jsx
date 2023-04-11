import React, { Component } from 'react';
import { connect } from 'react-redux';
import fillInBlankActions from '../../actions/fillInBlank';
import FillInBlankForm from './fillInBlankForm.jsx';

class EditFillInBlank extends Component {

  editQuestion = data => {
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    let questionData = data
    questionData.prompt = data.prompt.replace('<p>', '').replace('</p>', '')
    dispatch(fillInBlankActions.submitQuestionEdit(questionID, data));
  };

  returnQuestionState = () => {
    const { fillInBlank, match } = this.props
    const { data } = fillInBlank
    const { params } = match
    const { questionID } = params
    const fillInBlankQuestion = data[questionID];
    const { blankAllowed, caseInsensitive, conceptID, cues, cuesLabel, flag, instructions, itemLevel, prompt } = fillInBlankQuestion
    return {
      questionID,
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
