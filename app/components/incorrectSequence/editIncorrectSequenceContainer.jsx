import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import MultipleInputAndConceptSelectorForm from '../shared/multipleInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.js';

class EditIncorrectSequencesContainer extends Component {
  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
  }

  getIncorrectSequence() {
    return this.props.questions.data[this.props.params.questionID].incorrectSequences[this.props.params.incorrectSequenceID];
  }

  submitForm(data, incorrectSequenceID) {
    delete data.conceptResults.null;
    this.props.dispatch(questionActions.submitEditedIncorrectSequence(this.props.params.questionID, data, incorrectSequenceID));
    window.history.back();
  }

  render() {
    return (
      <div>
        <MultipleInputAndConceptSelectorForm
          itemLabel='Focus Point'
          item={Object.assign(this.getIncorrectSequence(), { id: this.props.params.incorrectSequenceID, })}
          onSubmit={this.submitForm}
        />
        {this.props.children}
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions,
  };
}

export default connect(select)(EditIncorrectSequencesContainer);
