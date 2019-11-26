import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.ts';
import request from 'request'

class EditIncorrectSequencesContainer extends Component {
  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
  }

  componentWillMount() {
    const qid = this.props.params.questionID
    if (!this.props.generatedIncorrectSequences.used[qid]) {
      this.props.dispatch(questionActions.getUsedSequences(qid))
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
    const {generatedIncorrectSequences, params, questions, fillInBlank, sentenceFragments, diagnosticQuestions, states} = this.props
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          diagnosticQuestions
          fillInBlank
          item={Object.assign(this.getIncorrectSequence(), { id: params.incorrectSequenceID, })}
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitForm}
          questionID={params.questionID}
          questions={questions}
          sentenceFragments
          states
          usedSequences={generatedIncorrectSequences.used[params.questionID]}
        />
        {this.props.children}
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions,
    generatedIncorrectSequences: props.generatedIncorrectSequences,
    fillInBlank: props.fillInBlank,
    sentenceFragments: props.sentenceFragments,
    diagnosticQuestions: props.diagnosticQuestions,
    states: props.states
  };
}

export default connect(select)(EditIncorrectSequencesContainer);
