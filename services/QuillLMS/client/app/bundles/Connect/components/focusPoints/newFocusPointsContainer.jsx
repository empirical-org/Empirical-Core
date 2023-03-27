import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';
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
    const { questionType } = this.state
    const { match } = this.props
    const { params } = match
    const { questionID } = params
    return this.props[questionType].data[questionID].focusPoints;
  }

  submitFocusPointForm = data => {
    const { actionFile } = this.state
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    delete data.conceptResults.null;
    data.order = _.keys(this.getFocusPoints()).length + 1;
    dispatch(actionFile.submitNewFocusPoint(questionID, data));
    window.history.back();
  };

  render() {
    const { match, questions, sentenceFragments } = this.props
    const { params } = match
    const { questionID } = params
    if(questions && questionID && sentenceFragments) {
      return (
        <div>
          <FocusPointsInputAndConceptResultSelectorForm
            itemLabel="Focus Point"
            onSubmit={this.submitFocusPointForm}
            questionID={questionID}
            questions={questions}
            sentenceFragments={sentenceFragments}
            states={true}
          />
        </div>
      );
    } else {
      return (
        <h1>Loading...</h1>
      );
    }
  }
}

function select(props) {
  return {
    sentenceFragments: props.sentenceFragments,
    questions: props.questions,
  }
}

export default connect(select)(NewFocusPointsContainer);
