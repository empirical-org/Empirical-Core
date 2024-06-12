import * as React from 'react';
import _ from 'underscore';
import { connect } from 'react-redux';

import ResponseComponent from '../questions/responseComponent'
import * as questionActions from '../../actions/questions';
import { IncorrectSequencesInputAndConceptSelectorForm, } from '../../../Shared/index';

class NewIncorrectSequencesContainer extends React.Component {
  UNSAFE_componentWillMount() {
    const qid = this.props.match.params.questionID
    if (!this.props.generatedIncorrectSequences.used[qid]) {
      this.props.dispatch(questionActions.getUsedSequences(qid))
    }
  }

  submitSequenceForm = (data) => {
    const { dispatch, match, history, questions } = this.props
    const incorrectSequences = questions.data[match.params.questionID].incorrectSequences
    delete data.conceptResults.null;
    data.order = _.keys(incorrectSequences).length;
    // the only difference in the route between this page and the one where you can see all the incorrect sequences is the `/new` at the end of the path, so removing that will send us back to the main list
    const url = match.url.replace('/new', '')
    const callback = () => {
      history.push(url)
    }
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
          ResponseComponent={ResponseComponent}
          states={questions.states}
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
