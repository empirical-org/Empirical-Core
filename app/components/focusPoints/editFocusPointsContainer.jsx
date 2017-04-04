import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import MultipleInputAndConceptSelectorForm from '../shared/multipleInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.js';

class EditFocusPointsContainer extends Component {
  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
  }

  getFocusPoint() {
    return this.props.questions.data[this.props.params.questionID].focusPoints[this.props.params.focusPointID];
  }

  submitForm(data, focusPointID) {
    delete data.conceptResults.null;
    this.props.dispatch(questionActions.submitEditedFocusPoint(this.props.params.questionID, data, focusPointID));
    window.history.back();
  }

  render() {
    return (
      <div>
        <MultipleInputAndConceptSelectorForm
          itemLabel='Focus Point'
          item={Object.assign(this.getFocusPoint(), { id: this.props.params.focusPointID, })}
          onSubmit={this.submitForm}
        />
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

export default connect(select)(EditFocusPointsContainer);
