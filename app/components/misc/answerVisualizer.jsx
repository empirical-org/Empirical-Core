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

  sortResponsesByCount(responseObj) {
    let sortable = [];
    for(var response in responseObj) {
      sortable.push([responseObj[response].text, responseObj[response].count]);
    }
    sortable.sort((a, b) => {
      return b[1] - a[1];
    });
    return sortable.map((response) => {
      return response[0];
    });
  }

  getHumanCorrectResponses() {
    return this.sortResponsesByCount(_.reject(_.values(_.mapObject(this.state.responses, (r) => {
      return r.statusCode == 0 ? {text: r.text, count: r.count}: null;
    })), (r) => { return !r }));
  }

  getHumanIncorrectResponses() {
    return this.sortResponsesByCount(_.reject(_.values(_.mapObject(this.state.responses, (r) => {
      return r.statusCode == 1 ? {text: r.text, count: r.count} : null;
    })), (r) => { return !r }));
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

  renderDiffsBetweenIncorrectResponsesAndPrompt() {
    return this.getHumanIncorrectResponses().map((response) => {
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
          <div className="card is-fullwidth has-bottom-margin">
            <div className="card-content">
              <h1 className="title is-3">Diffs Between Incorrect Responses and Prompt</h1>
              {this.renderDiffsBetweenIncorrectResponsesAndPrompt()}
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
