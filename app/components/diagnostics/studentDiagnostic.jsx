import React from 'react'
import {connect} from 'react-redux'

var StudentDiagnostic = React.createClass({
  render: function() {
    console.log(this.props)
    return (
      <div>Hello today is Friday</div>
    )
  }
})

function select(state) {
  return {
    routing: state.routing,
    playDiagnostic: state.playDiagnostic
  }
}
export default connect(select)(StudentDiagnostic)
