import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import MultipleInputAndConceptSelectorForm from '../shared/multipleInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.js';
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
    return this.props[this.state.questionType].data[this.props.params.questionID].focusPoints[this.props.params.focusPointID];
  }

  submitForm(data, focusPointID) {
    delete data.conceptResults.null;
    this.props.dispatch(this.state.actionFile.submitEditedFocusPoint(this.props.params.questionID, data, focusPointID));
    window.history.back();
  }

  render() {
    return (
      <div>
        <MultipleInputAndConceptSelectorForm
          itemLabel='Focus Point'
          item={Object.assign(this.getFocusPoint(), { id: this.props.params.focusPointID, })}
          onSubmit={this.submitForm}
        />
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

export default connect(select)(EditFocusPointsContainer);
