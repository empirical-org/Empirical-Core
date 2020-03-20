import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import FocusPointsInputAndConceptResultSelectorForm from '../shared/focusPointsInputAndConceptSelectorForm'
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';

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
    const { params } = this.props;
    const { focusPointID, questionID } = params;
    const focusPoint = this.props[questionType].data[questionID].focusPoints[focusPointID]
    return Object.assign(focusPoint, { id: focusPointID, });
  }

  submitForm = (data, focusPointID) => {
    const { dispatch, params } = this.props;
    const { actionFile } = this.state;
    const { questionID } = params;
    delete data.conceptResults.null;
    dispatch(actionFile.submitEditedFocusPoint(questionID, data, focusPointID));
    window.history.back();
  };

  render() {
    const { children, params, questions, sentenceFragments } = this.props;
    const { questionID } = params;
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
