import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import MultipleInputAndConceptSelectorForm from '../shared/multipleInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.js';

class NewIncorrectSequencesContainer extends Component {
  constructor() {
    super();
    this.submitSequenceForm = this.submitSequenceForm.bind(this);
  }

  submitSequenceForm(data) {
    delete data.conceptResults.null;
    this.props.dispatch(questionActions.submitNewIncorrectSequence(this.props.params.questionID, data));
    window.history.back();
  }

  render() {
    return (
      <div>
        <MultipleInputAndConceptSelectorForm itemLabel='Incorrect Sequence' onSubmit={this.submitSequenceForm} />
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

export default connect(select)(NewIncorrectSequencesContainer);
