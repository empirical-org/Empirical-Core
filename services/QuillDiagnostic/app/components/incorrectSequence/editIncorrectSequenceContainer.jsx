import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions';
import request from 'request'

class EditIncorrectSequencesContainer extends Component {
  componentWillMount() {
    const { dispatch, generatedIncorrectSequences, params } = this.props;
    const { used } = generatedIncorrectSequences;
    const { questionID } = params;
    if (!used[questionID]) {
      dispatch(questionActions.getUsedSequences(questionID))
    }
  }

  getIncorrectSequence() {
    const { questions, params } = this.props;
    const { data } = questions;
    const { incorrectSequenceID, questionID } = params;
    return data[questionID].incorrectSequences[incorrectSequenceID];
  }

  submitForm = (data, incorrectSequenceID) => {
    const { dispatch, params } = this.props;
    const { questionID } = params;
    delete data.conceptResults.null;
    dispatch(questionActions.submitEditedIncorrectSequence(questionID, data, incorrectSequenceID));
    window.history.back();
  };

  render() {
    const {children, generatedIncorrectSequences, params, questions } = this.props;
    const { used } = generatedIncorrectSequences;
    const { incorrectSequenceID, questionID } = params;
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          diagnosticQuestions
          fillInBlank
          item={Object.assign(this.getIncorrectSequence(), { id: incorrectSequenceID, })}
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitForm}
          questionID={questionID}
          questions={questions}
          sentenceFragments
          states
          usedSequences={used[questionID]}
        />
        {children}
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
