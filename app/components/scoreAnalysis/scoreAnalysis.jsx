import React, { Component } from 'react';
import { connect } from 'react-redux';

class ScoreAnalysis extends Component {
  constructor(props) {
    super();
  }

  render() {
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
  }

}

function select(state) {
  return {
    questions: state.questions,
    routing: state.routing,
  };
}

export default connect(select)(ScoreAnalysis);
