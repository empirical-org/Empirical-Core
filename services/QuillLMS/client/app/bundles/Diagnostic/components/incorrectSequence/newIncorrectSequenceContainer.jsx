import React, { Component } from 'react';
import { connect } from 'react-redux';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments.ts';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm.jsx';

class NewIncorrectSequencesContainer extends Component {
  constructor() {
    super();

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = { questionType, actionFile, questionTypeLink };
  }

  UNSAFE_componentWillMount() {
    const { actionFile } = this.state;
    const { dispatch, generatedIncorrectSequences, match } = this.props;
    const { used } = generatedIncorrectSequences;
    const { params, url } = match;
    const { questionID } = params;
    const type = url.includes('sentence-fragments') ? 'sentence-fragment' : 'sentence-combining'
    if (!used[questionID]) {
      dispatch(actionFile.getUsedSequences(questionID, type))
    }
  }

  submitSequenceForm = data => {
    const { actionFile, questionTypeLink } = this.state;
    const { dispatch, history, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    delete data.conceptResults.null;
    // TODO: fix add new incorrect sequence action to show new incorrect sequence without refreshing
    dispatch(actionFile.submitNewIncorrectSequence(questionID, data));
    history.push(`/admin/${questionTypeLink}/${questionID}/incorrect-sequences`)
  }

  render() {
    const { fillInBlank, generatedIncorrectSequences, match, sentenceFragments, questions } = this.props;
    const { used } = generatedIncorrectSequences;
    const { params } = match;
    const { questionID } = params;
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          fillInBlank={fillInBlank}
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
    fillInBlank: props.fillInBlank,
    questions: props.questions,
    generatedIncorrectSequences: props.generatedIncorrectSequences,
    sentenceFragments: props.sentenceFragments,
    states: props.states
  };
}

export default connect(select)(NewIncorrectSequencesContainer);
