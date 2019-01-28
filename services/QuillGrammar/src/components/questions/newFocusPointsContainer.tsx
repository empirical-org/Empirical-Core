import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import FocusPointsInputAndConceptResultSelectorForm from '../shared/focusPointsInputAndConceptSelectorForm'
import * as questionActions from '../../actions/questions';

class NewFocusPointsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.submitFocusPointForm = this.submitFocusPointForm.bind(this);
  }

  getFocusPoints() {
    return this.props.questions.data[this.props.match.params.questionID].focusPoints;
  }

  submitFocusPointForm(data) {
    delete data.conceptResults.null;
    data.order = _.keys(this.getFocusPoints()).length + 1;
    questionActions.submitNewFocusPoint(this.props.match.params.questionID, data);
    window.history.back();
  }

  render() {
    return (
      <div>
        <FocusPointsInputAndConceptResultSelectorForm
          itemLabel="Focus Point"
          onSubmit={this.submitFocusPointForm}
          questionID={this.props.match.params.questionID}
          questions={this.props.questions}
        />
        {this.props.children}
      </div>
    );
  }
}

function select(props) {
  return {
    questions: props.questions,
  }
}

export default connect(select)(NewFocusPointsContainer);
