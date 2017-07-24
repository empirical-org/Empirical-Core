import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'
import {hashToCollection} from '../../libs/hashToCollection'
import QuestionsList from './diagnosticQuestionsList.jsx'

const DiagnosticQuestions = React.createClass({

  render: function () {
    if (this.props.diagnosticQuestions.hasreceiveddata) {
      const diagnosticQuestions = hashToCollection(this.props.diagnosticQuestions.data)
      return (
        <section className="section">
          <div className="container">
            <Link to={'admin/diagnostic-questions/new'}>
            <button className="button is-primary">Create a New Diagnostic Question</button>
            </Link>
            <p className="menu-label">Diagnostic Questions</p>
            <QuestionsList diagnosticQuestions={diagnosticQuestions || []}/>
          </div>
        </section>
      )
    }

    else {
      return (
        <div>
          hi
        </div>
      )
    }
  }

})


function select(state) {
  return {
    diagnosticQuestions: state.diagnosticQuestions,
    routing: state.routing
  }
}

export default connect(select)(DiagnosticQuestions)
