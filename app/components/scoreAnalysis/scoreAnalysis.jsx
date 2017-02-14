import React, { Component } from 'react';
import { connect } from 'react-redux';
import scoreActions from '../../actions/scoreAnalysis.js';
import LoadingSpinner from '../shared/spinner.jsx';

class ScoreAnalysis extends Component {
  constructor(props) {
    super();
  }

  componentWillMount() {
    this.props.dispatch(scoreActions.loadScoreData());
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
              <tr>
                <td>Name</td>
                <td>Responses</td>
                <td>Attempts</td>
                <td>Unmatched</td>
                <td>Common Unmatched</td>
              </tr>
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
