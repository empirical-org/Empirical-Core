import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import FocusPointsInputAndConceptResultSelectorForm from '../shared/focusPointsInputAndConceptSelectorForm'
// import MultipleInputAndConceptSelectorForm from '../shared/multipleInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.js';
import sentenceFragmentActions from '../../actions/sentenceFragments.js';

class NewFocusPointsContainer extends Component {
  constructor() {
    super();
    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = { questionType, questionTypeLink, actionFile }

    this.submitFocusPointForm = this.submitFocusPointForm.bind(this);
  }

  getFocusPoints() {
    return this.props[this.state.questionType].data[this.props.params.questionID].focusPoints;
  }

  submitFocusPointForm(data) {
    delete data.conceptResults.null;
    data.order = _.keys(this.getFocusPoints()).length + 1;
    this.state.actionFile.submitNewFocusPoint(this.props.params.questionID, data);
    window.history.back();
  }

  render() {
    const states = true
    return (
      <div>
        <FocusPointsInputAndConceptResultSelectorForm
          itemLabel="Focus Point"
          onSubmit={this.submitFocusPointForm}
          questionID={this.props.params.questionID}
          questions={this.props.questions}
          sentenceFragments={this.props.sentenceFragments}
          diagnosticQuestions={this.props.diagnosticQuestions}
          fillInBlank={this.props.fillInBlank}
          states={states}
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
    diagnosticQuestions: props.diagnosticQuestions,
    fillInBlank: props.fillInBlank
  }
}

export default connect(select)(NewFocusPointsContainer);
