import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments.js';
import request from 'request'

class EditIncorrectSequencesContainer extends Component {
  constructor() {
    super();

    const questionType = window.location.href.includes('sentence-fragments') ? 'sentenceFragments' : 'questions'
    const questionTypeLink = questionType === 'sentenceFragments' ? 'sentence-fragments' : 'questions'
    const actionFile = questionType === 'sentenceFragments' ? sentenceFragmentActions : questionActions

    this.state = {
      questionType,
      questionTypeLink,
      actionFile
    }

    this.submitForm = this.submitForm.bind(this);
  }

  componentWillMount() {
    const qid = this.props.params.questionID
    if (!this.props.generatedIncorrectSequences.used[qid] && this.state.actionFile.getUsedSequences) {
      this.props.dispatch(this.state.actionFile.getUsedSequences(this.props.params.questionID))
    }
  }

  getIncorrectSequence() {
    return this.props[this.state.questionType].data[this.props.params.questionID].incorrectSequences[this.props.params.incorrectSequenceID];
  }

  submitForm(data, incorrectSequenceID) {
    delete data.conceptResults.null;
    this.props.dispatch(questionActions.submitEditedIncorrectSequence(this.props.params.questionID, data, incorrectSequenceID));
    window.history.back();
  }

  render() {
    const { generatedIncorrectSequences, params, questions, sentenceFragments, states, } = this.props
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          item={Object.assign(this.getIncorrectSequence(), { id: params.incorrectSequenceID, })}
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitForm}
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

export default connect(select)(EditIncorrectSequencesContainer);
