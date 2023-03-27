import * as React from 'react';
import { connect } from 'react-redux';
import * as questionActions from '../../actions/questions';
import FocusPointsInputAndConceptResultSelectorForm from '../shared/focusPointsInputAndConceptSelectorForm';

class EditFocusPointsContainer extends React.Component {
  constructor() {
    super();

    this.submitForm = this.submitForm.bind(this);
  }

  getFocusPoint() {
    return this.props.questions.data[this.props.match.params.questionID].focusPoints[this.props.match.params.focusPointID];
  }

  submitForm(data, focusPointID) {
    delete data.conceptResults.null;
    this.props.dispatch(questionActions.submitEditedFocusPoint(this.props.match.params.questionID, data, focusPointID));
    setTimeout(() => {window.history.back()}, 2000);
  }

  render() {
    return (
      <div>
        <FocusPointsInputAndConceptResultSelectorForm
          item={Object.assign(this.getFocusPoint(), { id: this.props.match.params.focusPointID, })}
          itemLabel='Focus Point'
          onSubmit={this.submitForm}
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
    questions: props.questions
  }
}

export default connect(select)(EditFocusPointsContainer);
