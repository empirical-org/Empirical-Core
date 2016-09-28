import React from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import questionActions from '../../actions/questions'
import _ from 'underscore'
import {hashToCollection} from '../../libs/hashToCollection'
import C from '../../constants'
import ResponseComponent from '../questions/responseComponent.jsx'

const DiagnosticQuestion =  React.createClass({

  render: function () {
    return (
      <div>
        New Component
      </div>
    )
  },

})


function select(state) {
  return {
    concepts: state.concepts,
    diagnosticQuestions: state.diagnosticQuestions,
    itemLevels: state.itemLevels,
    routing: state.routing
  }
}

export default connect(select)(Question)
