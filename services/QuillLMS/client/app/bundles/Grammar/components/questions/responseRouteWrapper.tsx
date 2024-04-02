import * as React from 'react';
import { connect } from 'react-redux';
import ResponseComponent from './responseComponent';

class ResponseComponentWrapper extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      responses: {},
      loadedResponses: false
    }
  }

  UNSAFE_componentWillMount() {
    const { questionID, } = this.props.match.params;
  }

  getResponses() {
    return this.state.responses;
  }

  returnAppropriateDataset() {
    const { questionID, } = this.props.match.params;
    const theDatasetYouAreLookingFor = this.props.questions.data[questionID];
    const mode = 'questions';
    return { dataset: theDatasetYouAreLookingFor, mode, }; // "These are not the datasets you're looking for."
  }

  render() {
    const appropriateData = this.returnAppropriateDataset();
    const { dataset, mode, } = appropriateData;
    const { states, } = this.props.questions;
    const { questionID, } = this.props.match.params;
    return (
      <ResponseComponent
        admin
        dispatch={this.props.dispatch}
        mode={mode}
        question={dataset}
        questionID={questionID}
        responses={this.getResponses()}
        states={states}
      />
    );
  }
}

function select(state) {
  return {
    questions: state.questions,
    fillInBlank: state.fillInBlank,
    sentenceFragments: state.sentenceFragments,
    routing: state.routing,
  };
}

export default connect(select)(ResponseComponentWrapper);
