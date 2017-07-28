import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'
import {hashToCollection} from '../../libs/hashToCollection'
import QuestionsList from './diagnosticQuestionsList.jsx'
import ArchivedButton from '../shared/archivedButton.jsx'

const DiagnosticQuestions = React.createClass({
  getInitialState() {
    return {
      showOnlyArchived: false,
    };
  },

  toggleShowArchived() {
    this.setState({
      showOnlyArchived: !this.state.showOnlyArchived,
    });
  },

  render: function () {
    if (this.props.diagnosticQuestions.hasreceiveddata) {
      const diagnosticQuestions = hashToCollection(this.props.diagnosticQuestions.data)
      return (
        <section className="section">
          <div className="container">
            <Link to={'admin/diagnostic-questions/new'}>
            <button className="button is-primary">Create a New Diagnostic Question</button>
            </Link>
            <ArchivedButton showOnlyArchived={this.state.showOnlyArchived} toggleShowArchived={this.toggleShowArchived} lessons={false} />
            <p className="menu-label">Diagnostic Questions</p>
            <QuestionsList diagnosticQuestions={diagnosticQuestions || []} showOnlyArchived={this.state.showOnlyArchived}/>
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
