import * as React from 'react';
import { connect } from 'react-redux';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm';
import * as questionActions from '../../actions/questions';

class EditIncorrectSequencesContainer extends React.Component {
  constructor(props) {
    super(props);

    this.submitForm = this.submitForm.bind(this);
  }

  componentWillMount() {
    const qid = this.props.match.params.questionID
    if (!this.props.generatedIncorrectSequences.suggested[qid]) {
      this.props.dispatch(questionActions.getSuggestedSequences(qid))
    }
  }

  getIncorrectSequence() {
    return this.props.questions.data[this.props.match.params.questionID].incorrectSequences[this.props.match.params.incorrectSequenceID];
  }

  submitForm(data, incorrectSequenceID) {
    delete data.conceptResults.null;
    this.props.dispatch(questionActions.submitEditedIncorrectSequence(this.props.match.params.questionID, data, incorrectSequenceID));
    window.history.back();
  }

  render() {
    const {generatedIncorrectSequences, match, questions} = this.props
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitForm}
          suggestedSequences={generatedIncorrectSequences.suggested[match.params.questionID]}
          usedSequences={generatedIncorrectSequences.used[match.params.questionID]}
          coveredSequences={generatedIncorrectSequences.covered[match.params.questionID]}
          item={Object.assign(this.getIncorrectSequence(), { id: match.params.incorrectSequenceID, })}
          questions={questions}
          questionID={match.params.questionID}
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
