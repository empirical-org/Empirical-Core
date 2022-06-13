import * as React from 'react'
import { ActionTypes } from '../../actions/actionTypes'
import { connect } from 'react-redux'
import * as actions from '../../actions/conceptsFeedback'
import FeedbackForm from './feedbackForm'
import { ConceptExplanation } from '../../../Shared/index';
import { ConceptFeedback } from '../../interfaces/conceptsFeedback'
import { Match } from '../../interfaces/match'
import { Concept } from '../../interfaces/concepts'
import { ConceptsFeedbackState } from '../../reducers/conceptsFeedbackReducer'
import { ConceptReducerState } from '../../reducers/conceptsReducer'

interface ConceptFeedbackComponentProps {
  dispatch: Function;
  conceptsFeedback: ConceptsFeedbackState;
  concepts: ConceptReducerState;
  match: Match;
}

class ConceptFeedbackComponent extends React.Component<ConceptFeedbackComponentProps> {
  constructor(props: ConceptFeedbackComponentProps) {
    super(props)

    this.deleteConceptsFeedback = this.deleteConceptsFeedback.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.submitNewFeedback = this.submitNewFeedback.bind(this)
    this.cancelEdit = this.cancelEdit.bind(this)
    this.concept = this.concept.bind(this)
  }

  deleteConceptsFeedback() {
    const conceptFeedbackID = this.props.match.params.conceptFeedbackID
    if (conceptFeedbackID) {
      this.props.dispatch(actions.deleteConceptsFeedback(conceptFeedbackID))
    }
  }

  toggleEdit() {
    const conceptFeedbackID = this.props.match.params.conceptFeedbackID
    if (conceptFeedbackID) {
      this.props.dispatch(actions.startConceptsFeedbackEdit(conceptFeedbackID))
    }
  }

  submitNewFeedback(conceptFeedbackID: string, data: ConceptFeedback) {
    this.props.dispatch(actions.submitConceptsFeedbackEdit(conceptFeedbackID, data))
  }

  cancelEdit(conceptFeedbackID: string) {
    this.props.dispatch(actions.cancelConceptsFeedbackEdit(conceptFeedbackID))
  }

  concept() {
    const {conceptFeedbackID} = this.props.match.params;
    return this.props.concepts.hasreceiveddata ? this.props.concepts.data[0].find((c: Concept) => c.uid === conceptFeedbackID) : null
  }

  render() {
    const {data, states} = this.props.conceptsFeedback;
    const {conceptFeedbackID} = this.props.match.params;
    const concept = this.concept()
    const conceptName = concept ? <h4 className="title">{concept.displayName}</h4> : null
    if (data && conceptFeedbackID && data[conceptFeedbackID]) {
      const isEditing = (states[conceptFeedbackID] === ActionTypes.START_CONCEPTS_FEEDBACK_EDIT);
      if (isEditing) {
        return (
          <div key={this.props.match.params.conceptFeedbackID}>
            {conceptName}
            <FeedbackForm {...data[conceptFeedbackID]} cancelEdit={this.cancelEdit} conceptFeedbackID={conceptFeedbackID} submitNewFeedback={this.submitNewFeedback} />
          </div>
        )
      } else if (conceptFeedbackID) {
        return (
          <div key={conceptFeedbackID}>
            {conceptName}
            <ConceptExplanation {...data[conceptFeedbackID]} />
            <p className="control">
              <button className="button is-info" onClick={this.toggleEdit}>Edit Feedback</button> <button className="button is-danger" onClick={this.deleteConceptsFeedback}>Delete Concept Feedback</button>
            </p>
          </div>
        )
      }

    } else if (this.props.concepts.hasreceiveddata === false) {
      return (<p>Loading...</p>)
    } else if (conceptFeedbackID) {
      return (
        <div className="container" key={conceptFeedbackID}>
          {conceptName}
          <FeedbackForm
            cancelEdit={this.cancelEdit}
            conceptFeedbackID={conceptFeedbackID}
            submitNewFeedback={this.submitNewFeedback}
          />
        </div>
      )
    } else {
      return <p>We could not find this concept.</p>
    }

  }
}

function select(state: any) {
  return {
    concepts: state.concepts,
    conceptsFeedback: state.conceptsFeedback,
    questions: state.questions,
    routing: state.routing
  }
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(ConceptFeedbackComponent)
