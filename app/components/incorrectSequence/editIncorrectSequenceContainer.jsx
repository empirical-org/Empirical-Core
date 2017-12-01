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
    const {generatedIncorrectSequences, params, questions, fillInBlank, sentenceFragments, diagnosticQuestions, states} = this.props
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitForm}
          suggestedSequences={generatedIncorrectSequences.suggested[params.questionID]}
          usedSequences={generatedIncorrectSequences.used[params.questionID]}
          coveredSequences={generatedIncorrectSequences.covered[params.questionID]}
          item={Object.assign(this.getIncorrectSequence(), { id: params.incorrectSequenceID, })}
          questions={questions}
          questionID={params.questionID}
          fillInBlank
          sentenceFragments
          diagnosticQuestions
          states
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
