import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import fuzzy from 'fuzzyset.js';
import DiffedResponse from './diffedResponse.jsx';
import { listenToResponsesWithCallback } from '../../actions/responses';
import respWithStatus from '../../libs/responseTools.js';

export class AnswerVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      responses: {},
      loadedResponses: false
    };
  }

  componentWillMount() {
    listenToResponsesWithCallback(
      this.props.params.questionID,
      (data) => {
        this.setState({
          responses: respWithStatus(data),
          loadedResponses: true,
        });
      }
    );
  }

  getHumanCorrectResponses() {
    return _.reject(_.values(_.mapObject(this.state.responses, (r) => {
      return r.statusCode == 0 ? r.text : null;
    })), (r) => { return !r });
  }

  getHumanIncorrectResponses() {
    return _.reject(_.values(_.mapObject(this.state.responses, (r) => {
      return r.statusCode == 1 ? r.text : null;
    })), (r) => { return !r });
  }

  getClosestCorrectResponse(response) {
    return fuzzy(this.getHumanCorrectResponses()).get(response)[0][1];
  }

  renderDiffsBetweenIncorrectResponsesAndNearestCorrectResponse() {
    return this.getHumanIncorrectResponses().map((response) => {
      return(
        <DiffedResponse
          firstResponse={this.getClosestCorrectResponse(response)}
          newResponse={response}
        />
      );
    });
  }

  renderDiffsBetweenCorrectResponsesAndPrompt() {
    return this.getHumanCorrectResponses().map((response) => {
      return(
        <DiffedResponse
          firstResponse={this.props.questions.data[this.props.params.questionID].prompt.replace(/\n/g," ").replace(/(<([^>]+)>)/ig," ").replace(/&nbsp;/g, '')}
          newResponse={response}
        />
      );
    });
  }

  render() {
    if(this.state.loadedResponses) {
      return (
        <div>
          <div className="card is-fullwidth has-bottom-margin">
            <div className="card-content">
              <h1 className="title is-3">Diffs Between Incorrect Responses and Nearest Correct Response</h1>
              {this.renderDiffsBetweenIncorrectResponsesAndNearestCorrectResponse()}
            </div>
          </div>
          <div className="card is-fullwidth has-bottom-margin">
            <div className="card-content">
              <h1 className="title is-3">Diffs Between Correct Responses and Prompt</h1>
              {this.renderDiffsBetweenCorrectResponsesAndPrompt()}
            </div>
          </div>
          {this.props.children}
        </div>
      )
    } else {
      return <h1>Loading...</h1>;
    }
  }

}

function select(props) {
  return {
    questions: props.questions,
  };
}

export default connect(select)(AnswerVisualizer);
