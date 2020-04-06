import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.ts';
import sentenceFragmentActions from '../../actions/sentenceFragments.ts';

class EditIncorrectSequencesContainer extends Component {
  constructor(props) {
    super(props);

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = {
      questionType: questionType,
      questionTypeLink: questionTypeLink,
      actionFile: actionFile
    }
  }

  UNSAFE_componentWillMount() {
    const { actionFile } = this.state;
    const { dispatch, generatedIncorrectSequences, match } = this.props;
    const { used } = generatedIncorrectSequences;
    const { params } = match;
    const { questionID } = params;
    const type = window.location.href.includes('sentence-fragments') ? 'sentence-fragment' : 'sentence-combining'
    if (!used[questionID]) {
      dispatch(actionFile.getUsedSequences(questionID, type))
    }
  }

  getIncorrectSequence = () => {
    const { questions, match } = this.props;
    const { data } = questions;
    const { params } = match;
    const { incorrectSequenceID, questionID } = params;
    return data[questionID].incorrectSequences[incorrectSequenceID];
  }

  submitForm = (data, incorrectSequenceID) => {
    const { actionFile } = this.state;
    const { dispatch, match } = this.props;
    const { params } = match;
    const { questionID } = params;
    delete data.conceptResults.null;
    dispatch(actionFile.submitEditedIncorrectSequence(questionID, data, incorrectSequenceID));
    window.history.back();
  };

  render() {
    const {children, generatedIncorrectSequences, match, questions, sentenceFragments } = this.props;
    const { used } = generatedIncorrectSequences;
    const { params } = match;
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
          sentenceFragments={sentenceFragments}
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
