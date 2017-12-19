import React from 'react';
import { connect } from 'react-redux';
import {
  listenToResponsesWithCallback
} from '../../actions/responses';
import ResponseComponent from './responseComponent.jsx';

const ResponseComponentWrapper = React.createClass({
  getInitialState() {
    return {
      responses: {},
      loadedResponses: false,
    };
  },

  componentWillMount() {
    const { questionID, } = this.props.params;
    console.log('PARAMS: ', this.props.params);
  },

  getResponses() {
    return this.state.responses;
  },

  returnAppropriateDataset() {
    const { questionID, } = this.props.params;
    const datasets = ['fillInBlank', 'sentenceFragments', 'diagnosticQuestions'];
    let theDatasetYouAreLookingFor = this.props.questions.data[questionID];
    let mode = 'questions';
    datasets.forEach((dataset) => {
      if (this.props[dataset].data[questionID]) {
        theDatasetYouAreLookingFor = this.props[dataset].data[questionID];
        mode = dataset;
      }
    });
    return { dataset: theDatasetYouAreLookingFor, mode, }; // "These are not the datasets you're looking for."
  },

  render() {
    const appropriateData = this.returnAppropriateDataset();
    const { dataset, mode, } = appropriateData;
    const { states, } = this.props.questions;
    const { questionID, } = this.props.params;
    return (
      <ResponseComponent
        question={dataset}
        responses={this.getResponses()}
        questionID={questionID}
        states={states}
        dispatch={this.props.dispatch}
        mode={mode}
        admin
      />
    );
  },
});

function select(state) {
  return {
    questions: state.questions,
    fillInBlank: state.fillInBlank,
    sentenceFragments: state.sentenceFragments,
    diagnosticQuestions: state.diagnosticQuestions,
    routing: state.routing,
  };
}

export default connect(select)(ResponseComponentWrapper);
