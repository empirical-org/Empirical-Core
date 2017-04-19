import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import fuzzy from 'fuzzyset.js';
import DiffedResponse from './diffedResponse.jsx';

export class AnswerVisualizer extends Component {

  getClosestCorrectResponse(response) {
    // fuzzy(_.pluck(this.props.responses.data[this.props.params.questionID], 'text')).get(response);
  }

  render() {
    return (
      <div>
        <h1 className="title is-3">Answer Diff Visualizer</h1>
        <DiffedResponse
          firstResponse="Jared liked the dog. The dog was cute."
          newResponse="Jared liked the dog because it was cute."
        />
        {this.props.children}
      </div>
    )
  }

}

function select(props) {
  return {
    questions: props.questions,
    responses: props.responses,
  };
}

export default connect(select)(AnswerVisualizer);
