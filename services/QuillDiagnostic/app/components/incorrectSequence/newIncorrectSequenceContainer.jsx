import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions';

class NewIncorrectSequencesContainer extends Component {
  UNSAFE_componentWillMount() {
    const { dispatch, generatedIncorrectSequences, match } = this.props;
    const { used } = generatedIncorrectSequences;
    const { params, url } = match;
    const { questionID } = params;
    const type = url.includes('sentence-fragments') ? 'sentence-fragment' : 'sentence-combining'
    if (!used[questionID]) {
      dispatch(questionActions.getUsedSequences(questionID, type))
    }
  }

  submitSequenceForm = data => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    delete data.conceptResults.null;
    dispatch(questionActions.submitNewIncorrectSequence(questionID, data));
    window.history.back();
  };

  render() {
    const { children, generatedIncorrectSequences, match, questions } = this.props;
    const { used } = generatedIncorrectSequences;
    const { params } = match;
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

function select(state, props) {
  const { match } = props
  const { url } = match
  const questions = url.includes('sentence-fragments') ? state.sentenceFragments : state.questions
  return {
    questions,
    generatedIncorrectSequences: state.generatedIncorrectSequences,
    fillInBlank: state.fillInBlank,
    sentenceFragments: state.sentenceFragments,
    diagnosticQuestions: state.diagnosticQuestions,
    states: state.states
  };
}

export default connect(select)(NewIncorrectSequencesContainer);
