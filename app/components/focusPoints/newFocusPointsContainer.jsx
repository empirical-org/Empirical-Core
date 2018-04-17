import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import MultipleInputAndConceptSelectorForm from '../shared/multipleInputAndConceptSelectorForm.jsx';
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
    this.props.dispatch(this.state.actionFile.submitNewFocusPoint(this.props.params.questionID, data));
    window.history.back();
  }

  render() {
    return (
      <div>
        <MultipleInputAndConceptSelectorForm itemLabel="Focus Point" onSubmit={this.submitFocusPointForm} />
        {this.props.children}
      </div>
    );
  }
}

function select(props) {
  let mapState
  if (window.location.href.includes('sentence-fragments')) {
    mapState = {
      sentenceFragments: props.sentenceFragments
    };
  } else {
    mapState = {
      questions: props.questions
    };
  }
  return mapState
}

export default connect(select)(NewFocusPointsContainer);
