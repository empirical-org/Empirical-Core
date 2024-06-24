import React from 'react'

import { connect } from 'react-redux'
import { ConceptExplanation, FeedbackForm } from '../../../Shared/index'
import { default as actions, default as feedbackActions } from '../../actions/concepts-feedback'
import C from '../../constants'

class ConceptFeedback extends React.Component {

  constructor(props) {
    super(props)
    this.state = {translated: false}
  }
  cancelEdit = (feedbackID) => {
    const { dispatch } = this.props
    dispatch(actions.cancelConceptsFeedbackEdit(feedbackID))
  }

  deleteConceptsFeedback = () => {
    const { dispatch, match } = this.props
    const { params } = match
    const { conceptFeedbackID } = params
    if (confirm('⚠️ Are you sure you’d like to delete this concept feedback?')) {
      dispatch(actions.deleteConceptsFeedback(conceptFeedbackID))
    }
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

  toggleTranslation = () => {
    this.setState(prevState => (
      {translated: !prevState.translated}
    ))
  }

  renderTranslationButton(data) {
    const { translated } = this.state
    if(data.translatedDescription) {
      const buttonText = translated ? "Hide translation" : "Show translation"
      return <button className="button is-info" id='toggle-translation' onClick={this.toggleTranslation}>{buttonText}</button>
    }
  }


  concept = () => {
    const { match, concepts } = this.props
    const { params } = match
    const { conceptFeedbackID } = params

    return concepts.hasreceiveddata ? concepts.data[0].find((c) => c.uid === conceptFeedbackID) : null
  }

  render() {
    const { concepts, conceptsFeedback, match } = this.props
    const { data, states } = conceptsFeedback
    const { hasreceiveddata } = concepts
    const { params } = match
    const { conceptFeedbackID } = params

    const concept = this.concept()
    const conceptName = concept ? <h4 className="title">{concept.displayName}</h4> : null

    if (data && data[conceptFeedbackID]) {
      const isEditing = (states[conceptFeedbackID] === C.START_CONCEPTS_FEEDBACK_EDIT);
      if (isEditing) {
        return (
          <div className="admin-container" key={conceptFeedbackID}>
            {conceptName}
            <FeedbackForm {...data[conceptFeedbackID]} cancelEdit={this.cancelEdit} conceptFeedbackID={conceptFeedbackID} submitNewFeedback={this.submitNewFeedback} />
          </div>
        )
      } else {
        return (
          <div className="admin-container" key={conceptFeedbackID}>
            {conceptName}
            <ConceptExplanation {...data[conceptFeedbackID]} translated={this.state.translated} />
            <p className="concept-feedback-control">
              <button className="button is-info" onClick={this.toggleEdit}>Edit Feedback</button>
              <button className="button is-danger" onClick={this.deleteConceptsFeedback}>Delete Concept Feedback</button>
              { this.renderTranslationButton(data[conceptFeedbackID]) }
            </p>
          </div>
        )
      }

    } else if (hasreceiveddata === false){
      return (<p>Loading...</p>)
    } else {
      return (
        <div className="admin-container" key={conceptFeedbackID}>
          {conceptName}
          <FeedbackForm
            cancelEdit={this.cancelEdit}
            conceptFeedbackID={conceptFeedbackID}
            submitNewFeedback={this.submitNewFeedback}
          />
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
