import React from 'react'
import { connect } from 'react-redux'
import { ConceptExplanation } from '../../../Shared/index'
import { default as actions, default as feedbackActions } from '../../actions/concepts-feedback'
import C from '../../constants'
import FeedbackForm from './feedbackForm.jsx'

class ConceptFeedback extends React.Component {

  cancelEdit = (feedbackID) => {
    const { dispatch } = this.props
    dispatch(actions.cancelConceptsFeedbackEdit(feedbackID))
  }

  deleteConceptsFeedback = () => {
    const { dispatch, match } = this.props
    const { params } = match
    const { conceptFeedbackID } = params
    dispatch(actions.deleteConceptsFeedback(conceptFeedbackID))
  }

  submitNewFeedback = (feedbackID, data) => {
    const { dispatch } = this.props
    dispatch(feedbackActions.submitConceptsFeedbackEdit(feedbackID, data))
  }

  toggleEdit = () => {
    const { dispatch, match } = this.props
    const { params } = match
    const { conceptFeedbackID } = params
    dispatch(actions.startConceptsFeedbackEdit(conceptFeedbackID))
  }

  render() {
    const { concepts, conceptsFeedback, match } = this.props
    const { data, states } = conceptsFeedback
    const { hasreceiveddata } = concepts
    const { params } = match
    const { conceptFeedbackID } = params

    if (data && data[conceptFeedbackID]) {
      const isEditing = (states[conceptFeedbackID] === C.START_CONCEPTS_FEEDBACK_EDIT);
      if (isEditing) {
        return (
          <div className="admin-container" key={conceptFeedbackID}>
            <h4 className="title">{data[conceptFeedbackID].name}</h4>
            <FeedbackForm {...data[conceptFeedbackID]} cancelEdit={this.cancelEdit} feedbackID={conceptFeedbackID} submitNewFeedback={this.submitNewFeedback} />
          </div>
        )
      } else {
        return (
          <div className="admin-container" key={conceptFeedbackID}>
            <ConceptExplanation {...data[conceptFeedbackID]} />
            <p className="control">
              <button className="button is-info" onClick={this.toggleEdit}>Edit Feedback</button> <button className="button is-danger" onClick={this.deleteConceptsFeedback}>Delete Concept Feedback</button>
            </p>
          </div>
        )
      }

    } else if (hasreceiveddata === false){
      return (<p>Loading...</p>)
    } else {
      return (
        <div className="admin-container" key={conceptFeedbackID}>
          <FeedbackForm cancelEdit={this.cancelEdit} feedbackID={conceptFeedbackID} submitNewFeedback={this.submitNewFeedback} />
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
