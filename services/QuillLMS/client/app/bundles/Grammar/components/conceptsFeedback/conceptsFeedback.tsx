import * as React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions/conceptsFeedback'
import LinkListItem from '../shared/linkListItem'
import { ConceptsFeedbackState } from '../../reducers/conceptsFeedbackReducer'
import { ConceptReducerState } from '../../reducers/conceptsReducer'
import { Modal } from '../../../Shared/index'

interface ConceptsFeedbackProps {
  dispatch: Function;
  concepts: ConceptReducerState;
  conceptsFeedback: ConceptsFeedbackState;
}

class ConceptsFeedback extends React.Component<ConceptsFeedbackProps> {
  constructor(props: ConceptsFeedbackProps) {
    super(props)
  }

  createNew() {
    this.props.dispatch(actions.toggleNewConceptsFeedbackModal())
  }

  submitNewConceptFeedback() {
    const newConcept = {name: this.refs.newConceptName.value}
    this.props.dispatch(actions.submitNewConceptsFeedback(newConcept))
    this.refs.newConceptName.value = ""
    this.props.dispatch(actions.toggleNewConceptsFeedbackModal())
  }

  renderConceptsFeedback(): JSX.Element[] {
    const data = this.props.concepts.data;
    if (data && data[0]) {
      return data[0].sort((a, b) => a.displayName.localeCompare(b.displayName)).map((concept) => {
        const hasFeedback = !!this.props.conceptsFeedback.data[concept.uid];
        return (
          <LinkListItem
            activeClassName='is-active'
            basePath='concepts_feedback'
            className={hasFeedback ? "" : "no-feedback"}
            itemKey={concept.uid}
            key={concept.uid}
            text={concept.displayName}
          />
        )
      })
    } else {
      return [<li />]
    }
  }

  renderModal(): JSX.Element|void {
    const {submittingnew} = this.props.conceptsFeedback;
    const stateSpecificClass = submittingnew ? 'is-loading' : '';
    if (this.props.conceptsFeedback.newConceptModalOpen) {
      return (
        <Modal close={this.createNew}>
          <div className="box">
            <h4 className="title">Add New Concept</h4>
            <p className="control">
              <label className="label">Name</label>
              <input
                className="input"
                placeholder="Text input"
                ref="newConceptName"
                type="text"
              />
            </p>
            <p className="control">
              <button className={"button is-primary " + stateSpecificClass} onClick={this.submitNewConceptFeedback}>Submit</button>
            </p>
          </div>
        </Modal>
      )
    }
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column">
              <aside className="menu">
                <p className="menu-label">
                  Concepts
                </p>
                <ul className="menu-list">
                  {this.renderConceptsFeedback()}
                </ul>
              </aside>
            </div>
            <div className="column">
              {this.props.children}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

function select(state: any) {
  return {
    concepts: state.concepts,
    conceptsFeedback: state.conceptsFeedback,
    routing: state.routing
  }
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(ConceptsFeedback);
