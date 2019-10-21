import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.js';
import sentenceFragmentActions from '../../actions/sentenceFragments.js';

class NewIncorrectSequencesContainer extends Component {
  constructor() {
    super();

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = { questionType, actionFile, questionTypeLink };

    this.submitSequenceForm = this.submitSequenceForm.bind(this);
  }

  componentWillMount() {
    const qid = this.props.params.questionID
    if (!this.props.generatedIncorrectSequences.used[qid] && this.state.actionFile.getUsedSequences) {
      this.props.dispatch(this.state.actionFile.getUsedSequences(this.props.params.questionID))
    }
  }

  submitSequenceForm(data) {
    delete data.conceptResults.null;
    this.props.dispatch(this.state.actionFile.submitNewIncorrectSequence(this.props.params.questionID, data));
    window.history.back();
  }

  render() {
    const { generatedIncorrectSequences, params, questions, sentenceFragments, } = this.props
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitSequenceForm}
          questionID={params.questionID}
          questions={questions}
          sentenceFragments={sentenceFragments}
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
    sentenceFragments: props.sentenceFragments,
    states: props.states
  };
}

export default connect(select)(NewIncorrectSequencesContainer);
