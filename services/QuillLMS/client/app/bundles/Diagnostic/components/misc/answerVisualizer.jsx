import fuzzy from 'fuzzyset.js';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import { listenToResponsesWithCallback } from '../../actions/responses';
import respWithStatus from '../../libs/responseTools.js';
import DiffedResponse from './diffedResponse.jsx';

export class AnswerVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      responses: {},
      loadedResponses: false
    };
  }

  UNSAFE_componentWillMount() {
    const { params } = this.props;
    const { questionID } = params;
    listenToResponsesWithCallback(
      questionID,
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
    for(const response in responseObj) {
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
    const { responses } = this.state;
    return this.sortResponsesByCount(_.reject(_.values(_.mapObject(responses, (r) => {
      const { count, statusCode, text } = r;
      return statusCode === 0 ? { text, count } : null;
    })), (r) => { return !r }));
  }

  getHumanIncorrectResponses() {
    const { responses } = this.state;
    return this.sortResponsesByCount(_.reject(_.values(_.mapObject(responses, (r) => {
      const { count, statusCode, text } = r;
      return statusCode === 0 ? { text, count } : null;
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
    const { params } = this.props;
    const { questionID } = params;
    return this.getHumanCorrectResponses().map((response) => {
      return (
        <DiffedResponse
          firstResponse={this.props.questions.data[questionID].prompt.replace(/\n/g," ").replace(/(<([^>]+)>)/ig," ").replace(/&nbsp;/g, '')}
          newResponse={response}
        />
      );
    });
  }

  renderDiffsBetweenIncorrectResponsesAndPrompt() {
    const { params, questions } = this.props;
    const { questionID } = params;
    const { data } = questions;
    return this.getHumanIncorrectResponses().map((response) => {
      return (
        <DiffedResponse
          firstResponse={data[questionID].prompt.replace(/\n/g," ").replace(/(<([^>]+)>)/ig," ").replace(/&nbsp;/g, '')}
          newResponse={response}
        />
      );
    });
  }

  render() {
    const { loadedResponses } = this.state;
    const { children } = this.props;
    if(loadedResponses) {
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
          {children}
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
