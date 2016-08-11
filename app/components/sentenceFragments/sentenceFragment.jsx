import React from 'react'
import { connect } from 'react-redux'
import ResponseComponent from '../questions/responseComponent.jsx'

const SentenceFragment = React.createClass({
  render() {
    const {data, states, hasreceiveddata} = this.props.sentenceFragments;
    const {sentenceFragmentID} = this.props.params
    if (!hasreceiveddata) {
      return (
        <h1>Loading...</h1>
      )
    } else if (data[sentenceFragmentID]) {
      return (
        <div>
          <p>{data[sentenceFragmentID].questionText}</p>
          <ResponseComponent
          question={data[sentenceFragmentID]}
          questionID={sentenceFragmentID}
          states={states}
          dispatch={this.props.dispatch}
          admin={true}
          mode={"sentenceFragment"}/>
        </div>
      )
    } else {
      return (
        <h1>404</h1>
      )
    }

  }
})

function select(state) {
  return {
    sentenceFragments: state.sentenceFragments,
    routing: state.routing
  }
}

export default connect(select)(SentenceFragment)
