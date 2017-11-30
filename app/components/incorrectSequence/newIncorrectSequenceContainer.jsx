import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.js';
import request from 'request'

class NewIncorrectSequencesContainer extends Component {
  constructor() {
    super();

    this.submitSequenceForm = this.submitSequenceForm.bind(this);
  }

  componentWillMount() {
    const qid = this.props.params.questionID
    if (!this.props.generatedIncorrectSequences.suggested[qid]) {
      this.props.dispatch(questionActions.getSuggestedSequences(qid))
    }
  }

  submitSequenceForm(data) {
    delete data.conceptResults.null;
    this.props.dispatch(questionActions.submitNewIncorrectSequence(this.props.params.questionID, data));
    window.history.back();
  }

  render() {
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitSequenceForm}
          suggestedSequences={this.props.generatedIncorrectSequences.suggested[this.props.params.questionID]}
          usedSequences={this.props.generatedIncorrectSequences.used[this.props.params.questionID]}
          coveredSequences={this.props.generatedIncorrectSequences.covered[this.props.params.questionID]}
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

export default connect(select)(NewIncorrectSequencesContainer);
