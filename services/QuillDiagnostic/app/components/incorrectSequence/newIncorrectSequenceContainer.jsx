import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions';

class NewIncorrectSequencesContainer extends Component {
  componentWillMount() {
    const { dispatch, generatedIncorrectSequences, params } = this.props;
    const { used } = generatedIncorrectSequences;
    const { questionID } = params;
    if (!used[questionID]) {
      dispatch(questionActions.getUsedSequences(questionID))
    }
  }

  submitSequenceForm = data => {
    const { dispatch, params } = this.props;
    const { questionID } = params;
    delete data.conceptResults.null;
    dispatch(questionActions.submitNewIncorrectSequence(questionID, data));
    window.history.back();
  };

  render() {
    const { children, generatedIncorrectSequences, params, questions } = this.props;
    const { used } = generatedIncorrectSequences;
    const { questionID } = params;
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          diagnosticQuestions
          fillInBlank
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitSequenceForm}
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

export default connect(select)(NewIncorrectSequencesContainer);
