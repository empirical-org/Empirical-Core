import * as React from 'react'
import { connect } from 'react-redux'
import LinkListItem from '../shared/linkListItem'
import * as actions from '../../actions/concepts'

class Concepts extends React.Component {
  constructor(props) {
    super(props)
  }

  renderConcepts() {
    const data = this.props.concepts.data["0"];
    // const keys = _.keys(data["0"]);
    if (data) {
      return data.sort((a, b) => a.displayName.localeCompare(b.displayName)).map(concept =>
        (<LinkListItem
           key={concept.uid}
           itemKey={concept.uid}
           basePath='concepts'
           text={concept.displayName}
           activeClassName='is-active'
         />)
      )
    }
  }

  render(){
    // // console.log("this.props.concepts", this.props.concepts)
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

function select(state) {
  return {
    concepts: state.concepts,
    routing: state.routing
  }
}

export default connect(select)(Concepts)
