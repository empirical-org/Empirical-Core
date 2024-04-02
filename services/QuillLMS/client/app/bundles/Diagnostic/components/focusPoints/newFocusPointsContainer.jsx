import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments.ts';
import FocusPointsInputAndConceptResultSelectorForm from '../shared/focusPointsInputAndConceptSelectorForm';

class NewFocusPointsContainer extends Component {
  constructor() {
    super();
    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = { questionType, questionTypeLink, actionFile }
  }

  getFocusPoints = () => {
    const { questionType } = this.state;
    const { match } = this.props;
    const { params } = match;
    const { questionID } = params;
    return this.props[questionType].data[questionID].focusPoints;
  }

  submitFocusPointForm = data => {
    const { match } = this.props;
    const { params } = match;
    const { questionID } = params;
    delete data.conceptResults.null;
    data.order = _.keys(this.getFocusPoints()).length + 1;
    // TODO: fix add focus point action to show new focus point without refreshing
    this.props.dispatch(this.state.actionFile.submitNewFocusPoint(questionID, data));
    window.history.back();
  };

  render() {
    const { children, fillInBlank, match, questions, sentenceFragments } = this.props;
    const { params } = match;
    const { questionID } = params;
    return (
      <div>
        <FocusPointsInputAndConceptResultSelectorForm
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
    fillInBlank: props.fillInBlank
  }
}

export default connect(select)(NewFocusPointsContainer);
