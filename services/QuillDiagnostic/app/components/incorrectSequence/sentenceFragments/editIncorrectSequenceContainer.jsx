import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import MultipleInputAndConceptSelectorForm from '../../shared/multipleInputAndConceptSelectorForm.jsx';
import sentenceFragmentActions from '../../../actions/sentenceFragments.js';

class EditIncorrectSequencesContainer extends Component {
  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
  }

  getIncorrectSequence() {
    return this.props.sentenceFragments.data[this.props.params.questionID].incorrectSequences[this.props.params.incorrectSequenceID];
  }

  submitForm(data, incorrectSequenceID) {
    delete data.conceptResults.null;
    this.props.dispatch(sentenceFragmentActions.submitEditedIncorrectSequence(this.props.params.questionID, data, incorrectSequenceID));
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
    sentenceFragments: props.sentenceFragments,
  };
}

export default connect(select)(EditIncorrectSequencesContainer);
