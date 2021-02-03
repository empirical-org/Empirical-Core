import React from 'react';
import { connect } from 'react-redux';
import ResponseComponent from './responseComponent.jsx';

class ResponseComponentWrapper extends React.Component {
  state = {
    responses: {},
    loadedResponses: false,
  };

  getResponses = () => {
    const { responses } = this.state;
    return responses;
  };

  returnAppropriateDataset = () => {
    const { match, questions } = this.props;
    const { params } = match;
    const { questionID, } = params;
    const datasets = ['fillInBlank', 'sentenceFragments'];
    let theDatasetYouAreLookingFor = questions.data[questionID];
    let mode = 'questions';
    datasets.forEach((dataset) => {
      if (this.props[dataset].data[questionID]) {
        theDatasetYouAreLookingFor = this.props[dataset].data[questionID];
        mode = dataset;
      }
    });
    return { dataset: theDatasetYouAreLookingFor, mode, }; // "These are not the datasets you're looking for."
  };

  render() {
    const appropriateData = this.returnAppropriateDataset();
    const { dataset, mode, } = appropriateData;
    const { match, questions } = this.props;
    const { params } = match;
    const { states, } = questions;
    const { questionID, } = params;
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
