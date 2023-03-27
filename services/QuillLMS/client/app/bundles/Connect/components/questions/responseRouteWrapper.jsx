import React from 'react';
import { connect } from 'react-redux';
import ResponseComponent from './responseComponent.jsx';

class ResponseComponentWrapper extends React.Component {
  state = {
    responses: {},
    loadedResponses: false,
  };

  returnAppropriateDataset = () => {
    const { match, questions } = this.props
    const { data } = questions
    const { params } = match
    const { questionID, } = params;
    const datasets = ['fillInBlank', 'sentenceFragments']
    let datasetMatch = data[questionID]
    let mode = 'questions';
    datasets.forEach((dataset) => {
      if (this.props[dataset].data[questionID]) {
        datasetMatch = this.props[dataset].data[questionID]
        mode = dataset;
      }
    });
    return { dataset: datasetMatch, mode }
  };

  render() {
    const { responses } = this.state
    const { dispatch, match, questions } = this.props
    const { states } = questions
    const { params } = match
    const { questionID } = params
    const appropriateData = this.returnAppropriateDataset()
    const { dataset, mode } = appropriateData;

    return (
      <ResponseComponent
        admin
        dispatch={dispatch}
        mode={mode}
        question={dataset}
        questionID={questionID}
        responses={responses}
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
