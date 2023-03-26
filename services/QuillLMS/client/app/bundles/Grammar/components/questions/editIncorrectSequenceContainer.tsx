import * as React from 'react';
import { connect } from 'react-redux';
import * as questionActions from '../../actions/questions';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm';

class EditIncorrectSequencesContainer extends React.Component {
  UNSAFE_componentWillMount() {
    const qid = this.props.match.params.questionID
    if (!this.props.generatedIncorrectSequences.used[qid]) {
      this.props.dispatch(questionActions.getUsedSequences(qid))
    }
  }

  getIncorrectSequence() {
    return this.props.questions.data[this.props.match.params.questionID].incorrectSequences[this.props.match.params.incorrectSequenceID];
  }

  submitForm = (data, incorrectSequenceID) => {
    delete data.conceptResults.null;
    this.props.dispatch(questionActions.submitEditedIncorrectSequence(this.props.match.params.questionID, data, incorrectSequenceID));
    setTimeout(() => {window.history.back()}, 2000);
  }

  render() {
    const {generatedIncorrectSequences, match, questions} = this.props
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          item={Object.assign(this.getIncorrectSequence(), { id: match.params.incorrectSequenceID, })}
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitForm}
          questionID={match.params.questionID}
          questions={questions}
          usedSequences={generatedIncorrectSequences.used[match.params.questionID]}
        />
        {this.props.children}
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions,
    generatedIncorrectSequences: props.generatedIncorrectSequences
  };
}

export default connect(select)(EditIncorrectSequencesContainer);
