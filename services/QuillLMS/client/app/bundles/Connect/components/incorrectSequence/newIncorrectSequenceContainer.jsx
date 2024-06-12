import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import ResponseComponent from '../questions/responseComponent'
import questionActions from '../../actions/questions';
import sentenceFragmentActions from '../../actions/sentenceFragments';
import { IncorrectSequencesInputAndConceptSelectorForm, } from '../../../Shared/index';

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
    const { dispatch, match, history, questions } = this.props
    const incorrectSequences = questions.data[match.params.questionID].incorrectSequences
    delete data.conceptResults.null;
    data.order = _.keys(incorrectSequences).length;
    const url = match.url.replace('/new', '')
    const callback = () => {
      history.push(url)
    }
    dispatch(submitNewIncorrectSequence(match.params.questionID, data, callback));
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
          ResponseComponent={ResponseComponent}
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
