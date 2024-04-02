import * as React from 'react';
import { connect } from 'react-redux';
import * as questionActions from '../../actions/questions';
import IncorrectSequencesInputAndConceptSelectorForm from '../shared/incorrectSequencesInputAndConceptSelectorForm';

class NewIncorrectSequencesContainer extends React.Component {
  UNSAFE_componentWillMount() {
    const qid = this.props.match.params.questionID
    if (!this.props.generatedIncorrectSequences.used[qid]) {
      this.props.dispatch(questionActions.getUsedSequences(qid))
    }
  }

  submitSequenceForm = (data) => {
    const { dispatch, match, history, } = this.props
    delete data.conceptResults.null;
    // the only difference in the route between this page and the one where you can see all the incorrect sequences is the `/new` at the end of the path, so removing that will send us back to the main list
    const url = match.url.replace('/new', '')
    const callback = () => history.push(url)
    dispatch(questionActions.submitNewIncorrectSequence(match.params.questionID, data, callback))
  }

  render() {
    const {generatedIncorrectSequences, match, questions} = this.props
    return (
      <div>
        <IncorrectSequencesInputAndConceptSelectorForm
          itemLabel='Incorrect Sequence'
          onSubmit={this.submitSequenceForm}
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

export default connect(select)(NewIncorrectSequencesContainer);
