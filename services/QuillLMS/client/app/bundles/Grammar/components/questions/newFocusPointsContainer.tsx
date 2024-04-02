import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as questionActions from '../../actions/questions';
import FocusPointsInputAndConceptResultSelectorForm from '../shared/focusPointsInputAndConceptSelectorForm';

class NewFocusPointsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmitFocusPointForm = this.handleSubmitFocusPointForm.bind(this);
  }

  getFocusPoints() {
    const { questions, match, } = this.props
    return questions.data[match.params.questionID].focusPoints;
  }

  handleSubmitFocusPointForm(data) {
    const { dispatch, match, } = this.props
    delete data.conceptResults.null;
    data.order = _.keys(this.getFocusPoints()).length + 1;
    dispatch(questionActions.submitNewFocusPoint(match.params.questionID, data));
    window.history.back();
  }

  render() {
    const { children, match, questions, } = this.props
    return (
      <div>
        <FocusPointsInputAndConceptResultSelectorForm
          itemLabel="Focus Point"
          onSubmit={this.handleSubmitFocusPointForm}
          questionID={match.params.questionID}
          questions={questions}
        />
        {children}
      </div>
    );
  }
}

function select(props) {
  const { questions, } = props
  return {
    questions: questions,
  }
}

export default connect(select)(NewFocusPointsContainer);
