import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import FocusPointsInputAndConceptResultSelectorForm from '../shared/focusPointsInputAndConceptSelectorForm'
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments.js';

class EditFocusPointsContainer extends Component {
  constructor() {
    super();

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = { questionType, questionTypeLink, actionFile }

    this.submitForm = this.submitForm.bind(this);
  }

  getFocusPoint() {
    const focusPoint = this.props[this.state.questionType].data[this.props.params.questionID].focusPoints[this.props.params.focusPointID]
    return Object.assign(focusPoint, { id: this.props.params.focusPointID, });
  }

  submitForm(data, focusPointID) {
    delete data.conceptResults.null;
    this.props.dispatch(this.state.actionFile.submitEditedFocusPoint(this.props.params.questionID, data, focusPointID));
    window.history.back();
  }

  render() {
    return (
      <div>
        <FocusPointsInputAndConceptResultSelectorForm
          item={this.getFocusPoint()}
          itemLabel="Focus Point"
          onSubmit={this.submitForm}
          questionID={this.props.params.questionID}
          questions={this.props.questions}
          sentenceFragments={this.props.sentenceFragments}
          states={true}
        />
        {this.props.children}
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
