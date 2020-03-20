import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import FocusPointsInputAndConceptResultSelectorForm from '../shared/focusPointsInputAndConceptSelectorForm'
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';

class NewFocusPointsContainer extends Component {
  constructor() {
    super();
    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = { questionType, questionTypeLink, actionFile }
  }

  getFocusPoints() {
    const { questionType } = this.state;
    const { params } = this.props;
    const { questionID } = params;
    return this.props[questionType].data[questionID].focusPoints;
  }

  submitFocusPointForm = data => {
    const { params } = this.props;
    const { questionID } = params;
    delete data.conceptResults.null;
    data.order = _.keys(this.getFocusPoints()).length + 1;
    this.props.dispatch(this.state.actionFile.submitNewFocusPoint(questionID, data));
    window.history.back();
  };

  render() {
    const { children, diagnosticQuestions, fillInBlank, params, questions, sentenceFragments } = this.props;
    const { questionID } = params;
    return (
      <div>
        <FocusPointsInputAndConceptResultSelectorForm
          diagnosticQuestions={diagnosticQuestions}
          fillInBlank={fillInBlank}
          itemLabel="Focus Point"
          onSubmit={this.submitFocusPointForm}
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
    questions: props.questions,
    diagnosticQuestions: props.diagnosticQuestions,
    fillInBlank: props.fillInBlank
  }
}

export default connect(select)(NewFocusPointsContainer);
