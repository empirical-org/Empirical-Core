import React, { Component } from 'react';
import { connect } from 'react-redux';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm.jsx';

class NewIncorrectSequencesContainer extends Component {
  constructor() {
    super();

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = { questionType, actionFile, questionTypeLink };
  }

  componentDidMount() {
    const { actionFile } = this.state
    const { getUsedSequences } = actionFile
    const { dispatch, generatedIncorrectSequences, match } = this.props
    const { used } = generatedIncorrectSequences
    const { params } = match
    const { questionID } = params
    if (!used[questionID] && getUsedSequences) {
      dispatch(getUsedSequences(questionID))
    }
  }

  submitSequenceForm = data => {
    const { actionFile } = this.state
    const { submitNewIncorrectSequence } = actionFile
    const { dispatch, match } = this.props
    const { params } = match
    const { questionID } = params
    delete data.conceptResults.null;
    dispatch(submitNewIncorrectSequence(questionID, data));
    window.history.back();
  };

  render() {
    const { generatedIncorrectSequences, match, questions, sentenceFragments, } = this.props
    const { used } = generatedIncorrectSequences
    const { params } = match
    const { questionID } = params
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitSequenceForm}
          questionID={questionID}
          questions={questions}
          sentenceFragments={sentenceFragments}
          states
          usedSequences={used[questionID]}
        />
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions,
    generatedIncorrectSequences: props.generatedIncorrectSequences,
    sentenceFragments: props.sentenceFragments,
    states: props.states
  };
}

export default connect(select)(NewIncorrectSequencesContainer);
