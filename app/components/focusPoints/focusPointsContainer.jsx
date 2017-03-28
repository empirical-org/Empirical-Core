import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

class FocusPointsContainer extends Component {

  getQuestion() {
    return this.props.questions.data[this.props.params.questionID];
  }

  getFocusPoints() {
    return this.getQuestion().focusPoints;
  }

  renderFocusPointsList() {
    const components = _.mapObject(this.getFocusPoints(), (val, key) => (
      <div style={{ margin: 15, }}>
        <p>{val.text}</p>
        <p>{val.feedback}</p>
      </div>
    ));
    return _.values(components);
  }

  render() {
    console.log('Rendering');
    return (
      <div>
        <h1>Focus Points</h1>
        {this.renderFocusPointsList()}
        {this.props.children}
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions,
  };
}

export default connect(select)(FocusPointsContainer);
