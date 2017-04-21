import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import MultipleInputAndConceptSelectorForm from '../shared/multipleInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.js';

class NewFocusPointsContainer extends Component {
  constructor() {
    super();
    this.submitFocusPointForm = this.submitFocusPointForm.bind(this);
  }

  getFocusPoints() {
    return this.props.questions.data[this.props.params.questionID].focusPoints;
  }

  submitFocusPointForm(data) {
    delete data.conceptResults.null;
    data.order = _.keys(this.getFocusPoints()).length + 1;
    this.props.dispatch(questionActions.submitNewFocusPoint(this.props.params.questionID, data));
    window.history.back();
  }

  render() {
    return (
      <div>
        <MultipleInputAndConceptSelectorForm itemLabel="Focus Point" onSubmit={this.submitFocusPointForm} />
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

export default connect(select)(NewFocusPointsContainer);
