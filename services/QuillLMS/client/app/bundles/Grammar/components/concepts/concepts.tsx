import * as React from 'react'
import { connect } from 'react-redux'
import { Concept } from '../../interfaces/concepts'
import { ConceptReducerState } from '../../reducers/conceptsReducer'
import LinkListItem from '../shared/linkListItem'

interface ConceptsProps {
  concepts: ConceptReducerState;
}

class Concepts extends React.Component<ConceptsProps> {
  constructor(props: ConceptsProps) {
    super(props)
  }

  renderConcepts() {
    const data = this.props.concepts.data["0"];
    // const keys = _.keys(data["0"]);
    if (data) {
      return data.sort((a: Concept, b: Concept) => a.displayName.localeCompare(b.displayName)).map((concept: Concept) =>
        (<LinkListItem
          activeClassName='is-active'
          basePath='concepts'
          itemKey={concept.uid}
          key={concept.uid}
          text={concept.displayName}
        />)
      )
    }
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <aside className="menu">
            <p className="menu-label">
              Concepts
            </p>
            <ul className="menu-list">
              {this.renderConcepts()}
            </ul>
          </aside>
        </div>
      </section>
    )
  }
}

function select(state: any) {
  return {
    concepts: state.concepts,
    routing: state.routing
  }
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default connect(select, dispatch => ({dispatch}), mergeProps)(Concepts)
