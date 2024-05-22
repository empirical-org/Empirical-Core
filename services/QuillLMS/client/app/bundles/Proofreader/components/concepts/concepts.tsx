import * as React from 'react';
import { connect } from 'react-redux';
// import LinkListItem from '../shared/linkListItem'
import { Concept } from '../../interfaces/concepts';
import { ConceptReducerState } from '../../reducers/conceptsReducer';

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
        (<li>{concept.displayName}</li>)
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
