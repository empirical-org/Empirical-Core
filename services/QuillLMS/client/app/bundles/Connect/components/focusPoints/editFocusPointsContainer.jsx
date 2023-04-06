import React, { Component } from 'react';
import { connect } from 'react-redux';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import FocusPointsInputAndConceptResultSelectorForm from '../shared/focusPointsInputAndConceptSelectorForm';

class EditFocusPointsContainer extends Component {
  constructor() {
    super();

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = { questionType, questionTypeLink, actionFile }
  }

  getFocusPoint = () => {
    const { questionType } = this.state
    const { match } = this.props
    const { params } = match
    const { focusPointID, questionID } = params
    const focusPoint = this.props[questionType].data[questionID].focusPoints[focusPointID]
    return Object.assign(focusPoint, { id: focusPointID, });
  }

  submitForm = (data, focusPointID) => {
    const { actionFile } = this.state
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    delete data.conceptResults.null;
    dispatch(actionFile.submitEditedFocusPoint(questionID, data, focusPointID));
    setTimeout(() => {window.history.back()}, 2000);
  };

  render() {
    const { match, questions, sentenceFragments } = this.props
    const { params } = match
    const { questionID } = params
    return (
      <div>
        <FocusPointsInputAndConceptResultSelectorForm
          item={this.getFocusPoint()}
          itemLabel="Focus Point"
          onSubmit={this.submitForm}
          questionID={questionID}
          questions={questions}
          sentenceFragments={sentenceFragments}
          states={true}
        />
      </div>
    );
  }
}

function select(props) {
  return {
    sentenceFragments: props.sentenceFragments,
    questions: props.questions,
    fillInBlank: props.fillInBlank
  }
}

export default connect(select)(EditFocusPointsContainer);
