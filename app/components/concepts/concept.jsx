import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/concepts'
import _ from 'underscore'

const Concepts = React.createClass({

  // renderConcepts: function () {
  //   const {data} = this.props.concepts;
  //   const keys = _.keys(data);
  //   return keys.map((key) => {
  //     console.log(key, data, data[key])
  //     return (<li><Link to={'/admin/concepts/' + key}>{data[key].name}</Link></li>)
  //   })
  // },

  render: function (){
    console.log(this.props.concepts)
    const {data} = this.props.concepts, {conceptID} = this.props.params;
    if (data[conceptID]) {
      return (
        <div>
          <p>Concept: {data[conceptID].name}</p>

        </div>
      )
    } else {
      return (<p>Loading...</p>)
    }

  }
})

function select(state) {
  return {
    concepts: state.concepts,
    routing: state.routing
  }
}

export default connect(select)(Concepts)
