import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.js';
import request from 'request'

class EditIncorrectSequencesContainer extends Component {
  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
  }

  componentWillMount() {
    const qid = this.props.params.questionID
    if (!this.props.generatedIncorrectSequences.suggested[qid]) {
      this.props.dispatch(questionActions.getSuggestedSequences(qid))
    }
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
        <IncorrectSequencesInputAndConceptSelectorForm
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitForm}
          suggestedSequences={this.props.generatedIncorrectSequences.suggested[this.props.params.questionID]}
          usedSequences={this.props.generatedIncorrectSequences.used[this.props.params.questionID]}
          item={Object.assign(this.getIncorrectSequence(), { id: this.props.params.incorrectSequenceID, })}
        />
        {this.props.children}
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions,
    generatedIncorrectSequences: props.generatedIncorrectSequences
  };
}

export default connect(select)(EditIncorrectSequencesContainer);
