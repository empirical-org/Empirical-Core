import * as React from 'react'
import { ActionTypes } from '../../actions/actionTypes'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as actions from '../../actions/conceptsFeedback'
import _ from 'underscore'
import FeedbackForm from './feedbackForm'
import { ConceptExplanation } from 'quill-component-library/dist/componentLibrary';

class ConceptFeedback extends React.Component{
  constructor(props) {
    super(props)

    this.deleteConceptsFeedback = this.deleteConceptsFeedback.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.submitNewFeedback = this.submitNewFeedback.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
  }

  deleteConceptsFeedback() {
    this.props.dispatch(actions.deleteConceptsFeedback(this.props.match.params.conceptFeedbackID))
  }

  toggleEdit() {
    this.props.dispatch(actions.startConceptsFeedbackEdit(this.props.match.params.conceptFeedbackID))
  }

  submitNewFeedback(conceptFeedbackID, data) {
    if(true) {
      this.props.dispatch(actions.submitConceptsFeedbackEdit(conceptFeedbackID, data)
      )
    }
  }

  cancelEdit(conceptFeedbackID) {
      this.props.dispatch(actions.cancelConceptsFeedbackEdit(conceptFeedbackID))
  }

  render(){
    const {data, states} = this.props.conceptsFeedback;
    const {conceptFeedbackID} = this.props.match.params;

    if (data && data[conceptFeedbackID]) {
      const isEditing = (states[conceptFeedbackID] === ActionTypes.START_CONCEPTS_FEEDBACK_EDIT);
      if (isEditing) {
        return (
          <div key={this.props.match.params.conceptFeedbackID}>
            <h4 className="title">{data[conceptFeedbackID].name}</h4>
            <FeedbackForm {...data[conceptFeedbackID]} conceptFeedbackID={conceptFeedbackID} submitNewFeedback={this.submitNewFeedback} cancelEdit={this.cancelEdit}/>
          </div>
        )
      } else {
        return (
          <div key={this.props.match.params.conceptFeedbackID}>
            <ConceptExplanation {...data[conceptFeedbackID]}/>
            <p className="control">
              <button className="button is-info" onClick={this.toggleEdit}>Edit Feedback</button> <button className="button is-danger" onClick={this.deleteConceptsFeedback}>Delete Concept</button>
            </p>
          </div>
        )
      }

    } else if (this.props.concepts.hasreceiveddata === false){
      return (<p>Loading...</p>)
    } else {
      return (
        <div key={this.props.match.params.conceptFeedbackID} className="container">
          <p>404: No Concept Feedback Found... So lets make one! 🙌 🖋 🇬🇧 🇮🇳</p>
          <FeedbackForm conceptFeedbackID={this.props.match.params.conceptFeedbackID} submitNewFeedback={this.submitNewFeedback} cancelEdit={this.cancelEdit}/>
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
