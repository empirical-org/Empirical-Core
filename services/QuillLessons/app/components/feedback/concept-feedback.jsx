import React from 'react'
import C from '../../constants'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import actions from '../../actions/concepts-feedback'
import feedbackActions from '../../actions/concepts-feedback'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import FeedbackForm from './feedbackForm.jsx'
import ConceptExplanation from './conceptExplanation.jsx';

const ConceptFeedback = React.createClass({

  deleteConceptsFeedback: function () {
    this.props.dispatch(actions.deleteConceptsFeedback(this.props.params.feedbackID))
  },

  toggleEdit: function () {
    this.props.dispatch(actions.startConceptsFeedbackEdit(this.props.params.feedbackID))
  },

  submitNewFeedback: function (feedbackID, data) {
    if(true) {
      this.props.dispatch(feedbackActions.submitConceptsFeedbackEdit(feedbackID, data)
      )
    }
  },

  cancelEdit: function(feedbackID) {
      this.props.dispatch(actions.cancelConceptsFeedbackEdit(feedbackID))
  },

  render: function (){
    const {data, states} = this.props.conceptsFeedback;
    const {feedbackID} = this.props.params;

    if (data && data[feedbackID]) {
      const isEditing = (states[feedbackID] === C.START_CONCEPTS_FEEDBACK_EDIT);
      if (isEditing) {
        return (
          <div key={this.props.params.feedbackID}>
            <h4 className="title">{data[feedbackID].name}</h4>
            <FeedbackForm {...data[feedbackID]} feedbackID={feedbackID} submitNewFeedback={this.submitNewFeedback} cancelEdit={this.cancelEdit}/>
          </div>
        )
      } else {
        return (
          <div key={this.props.params.feedbackID}>
            <ConceptExplanation {...data[feedbackID]}/>
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
        <div key={this.props.params.feedbackID} className="container">
          <p>404: No Concept Feedback Found... So lets make one! 🙌 🖋 🇬🇧 🇮🇳</p>
          <FeedbackForm feedbackID={this.props.params.feedbackID} submitNewFeedback={this.submitNewFeedback} cancelEdit={this.cancelEdit}/>
        </div>
      )
    }

  }
})

function select(state) {
  return {
    concepts: state.concepts,
    conceptsFeedback: state.conceptsFeedback,
    questions: state.questions,
    routing: state.routing
  }
}

export default connect(select)(ConceptFeedback)
