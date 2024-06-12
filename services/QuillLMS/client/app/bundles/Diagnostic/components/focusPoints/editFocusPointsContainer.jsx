import React, { Component } from 'react';
import { connect } from 'react-redux';

import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments.ts';
import ResponseComponent from '../questions/responseComponent'
import { FocusPointsInputAndConceptSelectorForm, } from '../../../Shared/index';

class EditFocusPointsContainer extends Component {
  constructor() {
    super();

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = { questionType, questionTypeLink, actionFile, }
  }

  getFocusPoint() {
    const { questionType } = this.state;
    const { match } = this.props;
    const { params } = match;
    const { focusPointID, questionID } = params;
    const focusPoint = this.props[questionType].data[questionID].focusPoints[focusPointID]
    return Object.assign(focusPoint, { id: focusPointID, });
  }

  submitForm = (data, focusPointID) => {
    const { dispatch, match } = this.props;
    const { actionFile } = this.state;
    const { params } = match;
    const { questionID } = params;
    delete data.conceptResults.null;
    dispatch(actionFile.submitEditedFocusPoint(questionID, data, focusPointID));
    setTimeout(() => {window.history.back()}, 2000);
  };

  render() {
    const { children, match, questions, sentenceFragments } = this.props;
    const { params } = match;;
    const { questionID } = params;
    return (
      <div>
        <FocusPointsInputAndConceptSelectorForm
          item={this.getFocusPoint()}
          itemLabel="Focus Point"
          onSubmit={this.submitForm}
          questionID={questionID}
          questions={questions}
          ResponseComponent={ResponseComponent}
          sentenceFragments={sentenceFragments}
          states={true}
        />
        {children}
      </div>
    );
  }
}

function select(props) {
  return {
    sentenceFragments: props.sentenceFragments,
    questions: props.questions
  }
}

export default connect(select)(EditFocusPointsContainer);
