import React from 'react'
import C from '../../constants'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import actions from '../../actions/concepts-feedback'
import feedbackActions from '../../actions/concepts-feedback'
import _ from 'underscore'
import { ConceptExplanation } from 'quill-component-library/dist/componentLibrary'
import FeedbackForm from './feedbackForm.jsx'

class ConceptFeedback extends React.Component {
  deleteConceptsFeedback = () => {
    const { dispatch, params } = this.props;
    const { feedbackID } = params;
    dispatch(actions.deleteConceptsFeedback(feedbackID))
  };

  toggleEdit = () => {
    const { dispatch, params } = this.props;
    const { feedbackID } = params;
    dispatch(actions.startConceptsFeedbackEdit(feedbackID))
  };

  submitNewFeedback = (feedbackID, data) => {
    const { dispatch } = this.props;
    if(true) {
      dispatch(feedbackActions.submitConceptsFeedbackEdit(feedbackID, data)
      )
    }
  };

  cancelEdit = (feedbackID) => {
    const { dispatch } = this.props;
      dispatch(actions.cancelConceptsFeedbackEdit(feedbackID))
  };

  render() {
    const { concepts, conceptsFeedback, params } = this.props;
    const { hasreceiveddata } = concepts;
    const { data, states } = conceptsFeedback;
    const { feedbackID } = params;

    if (data && data[feedbackID]) {
      const isEditing = (states[feedbackID] === C.START_CONCEPTS_FEEDBACK_EDIT);
      if (isEditing) {
        return (
          <div key={feedbackID}>
            <h4 className="title">{data[feedbackID].name}</h4>
            <FeedbackForm {...data[feedbackID]} cancelEdit={this.cancelEdit} feedbackID={feedbackID} submitNewFeedback={this.submitNewFeedback} />
          </div>
        )
      } else {
        return (
          <div key={feedbackID}>
            <ConceptExplanation {...data[feedbackID]} />
            <p className="control">
              <button className="button is-info" onClick={this.toggleEdit}>Edit Feedback</button> <button className="button is-danger" onClick={this.deleteConceptsFeedback}>Delete Concept</button>
            </p>
          </div>
        )
      }

    } else if (hasreceiveddata === false){
      return (<p>Loading...</p>)
    } else {
      return (
        <div className="container" key={feedbackID}>
          <p>404: No Concept Feedback Found... So lets make one! 🙌 🖋 🇬🇧 🇮🇳</p>
          <FeedbackForm cancelEdit={this.cancelEdit} feedbackID={feedbackID} submitNewFeedback={this.submitNewFeedback} />
        </div>
      )
    }

  }
}

function select(state) {
  return {
    concepts: state.concepts,
    conceptsFeedback: state.conceptsFeedback,
    questions: state.questions,
    routing: state.routing
  }
}

export default connect(select)(ConceptFeedback)
