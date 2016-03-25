import React from 'react'
import { connect } from 'react-redux'
import actions from '../../actions/concepts'
import questionActions from '../../actions/questions'
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

  deleteConcept: function () {
    this.props.dispatch(actions.deleteConcept(this.props.params.conceptID))
  },

  submitNewQuestion: function () {
    this.props.dispatch(questionActions.submitNewQuestion({name: "test", conceptID: this.props.params.conceptID}))
  },

  render: function (){
    console.log(this.props.concepts)
    const {data} = this.props.concepts, {conceptID} = this.props.params;
    if (data[conceptID]) {
      return (
        <div>
          <p>Concept: {data[conceptID].name}</p>

          <button className="button is-primary" onClick={this.submitNewQuestion}>Add Question</button>
          <br/>
          <button className="button is-danger" onClick={this.deleteConcept}>Delete Concept</button>
        </div>
      )
    } else if (this.props.concepts.hasreceiveddata === false){
      return (<p>Loading...</p>)
    } else {
      return (
        <p>404: No Concept Found</p>
      )
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
