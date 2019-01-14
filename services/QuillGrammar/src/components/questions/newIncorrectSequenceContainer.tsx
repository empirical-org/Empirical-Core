import * as React from 'react';
import { connect } from 'react-redux';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm';
import * as questionActions from '../../actions/questions';

class NewIncorrectSequencesContainer extends React.Component {
  constructor(props) {
    super(props);

    this.submitSequenceForm = this.submitSequenceForm.bind(this);
  }

  componentWillMount() {
    const qid = this.props.match.params.questionID
    if (!this.props.generatedIncorrectSequences.suggested[qid]) {
      this.props.dispatch(questionActions.getSuggestedSequences(qid))
    }
  }

  submitSequenceForm(data) {
    delete data.conceptResults.null;
    this.props.dispatch(questionActions.submitNewIncorrectSequence(this.props.match.params.questionID, data));
    window.history.back();
  }

  render() {
    const {generatedIncorrectSequences, params, questions, fillInBlank, sentenceFragments, diagnosticQuestions, states} = this.props
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitSequenceForm}
          suggestedSequences={this.props.generatedIncorrectSequences.suggested[this.props.match.params.questionID]}
          usedSequences={this.props.generatedIncorrectSequences.used[this.props.match.params.questionID]}
          coveredSequences={this.props.generatedIncorrectSequences.covered[this.props.match.params.questionID]}
          questions={this.props.questions}
          questionID={this.props.match.params.questionID}
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
    states: props.states
  };
}

export default connect(select)(NewIncorrectSequencesContainer);
