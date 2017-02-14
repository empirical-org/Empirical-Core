import React, { Component } from 'react';
import { connect } from 'react-redux';
import scoreActions from '../../actions/scoreAnalysis.js';
import LoadingSpinner from '../shared/spinner.jsx';
import { hashToCollection } from '../../libs/hashToCollection.js';

class ScoreAnalysis extends Component {
  constructor(props) {
    super();
  }

  componentWillMount() {
    this.props.dispatch(scoreActions.loadScoreData());
  }

  renderRows() {
    const { questions, scoreAnalysis, } = this.props;

    return _.map(hashToCollection(questions.data), (question) => {
      const scoreData = scoreAnalysis.data[question.key];
      console.log(scoreData);
      if (scoreData) {
        return (
          <tr>
            <td>{question.prompt}</td>
            <td>{scoreData.responses}</td>
            <td>{scoreData.totalAttempts}</td>
            <td>{scoreData.unmatchedResponses}</td>
            <td>{scoreData.commonUnmatchedResponses}</td>
          </tr>
        );
      }
    });
  }

  render() {
    const { questions, scoreAnalysis, } = this.props;
    if (questions.hasreceiveddata && scoreAnalysis.hasreceiveddata) {
      return (
        <div>
          <h1>Hello World.</h1>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Responses</th>
                <th>Attempts</th>
                <th>Unmatched</th>
                <th>Common Unmatched</th>
              </tr>
            </thead>
            <tbody>
              {this.renderRows()}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (<LoadingSpinner />);
    }
  }

}

function select(state) {
  return {
    questions: state.questions,
    scoreAnalysis: state.scoreAnalysis,
    routing: state.routing,
  };
}

export default connect(select)(ScoreAnalysis);
