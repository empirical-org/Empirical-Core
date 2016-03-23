import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/concepts'
import _ from 'underscore'
import {Link} from 'react-router'

const Concept = React.createClass({
  createNew: function () {
    console.log("creating new")
    this.props.dispatch(actions.submitNewConcept({name: "and"}))
  },

  renderConcepts: function () {
    const {data} = this.props.concepts;
    const keys = _.keys(data);
    return keys.map((key) => {
      console.log(key, data, data[key])
      return (<li><Link to={'/admin/concepts/' + key}>{data[key].name}</Link></li>)
    })
  },

  render: function (){
    console.log(this.props.concepts)
    return (
      <div>
        <p>Concepts</p>
        <button onClick={this.createNew}>Create New concept</button>
        <ul>
          {this.renderConcepts()}
        </ul>
        {this.props.children}
      </div>
    )
  }
})

function select(state) {
  return {
    concepts: state.concepts,
    routing: state.routing
  }
}

export default connect(select)(Concept)
