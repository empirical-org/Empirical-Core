import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'

import SentenceFragmentsList from './sentenceFragmentsList.jsx'
import { hashToCollection } from '../../libs/hashToCollection'
import ArchivedButton from '../shared/archivedButton.jsx'
import { getDiagnosticQuestions } from '../../libs/getDiagnosticQuestions'
import { QuestionList } from 'quill-component-library/dist/componentLibrary';

class SentenceFragments extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showOnlyArchived: false,
      diagnosticQuestions: {}
    }

    this.toggleShowArchived = this.toggleShowArchived.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { sentenceFragments, lessons } = nextProps
    if (sentenceFragments.hasreceiveddata && lessons.hasreceiveddata) {
      if (Object.keys(this.state.diagnosticQuestions).length === 0 || !_.isEqual(this.props.sentenceFragments.data, sentenceFragments.data) || (!_.isEqual(this.props.lessons.data, lessons.data))) {
        this.setState({ diagnosticQuestions: getDiagnosticQuestions(lessons.data, sentenceFragments.data) })
      }
    }
  }

  toggleShowArchived() {
    this.setState({
      showOnlyArchived: !this.state.showOnlyArchived,
    });
  }

  render() {
    const sentenceFragments = hashToCollection(this.state.diagnosticQuestions)
    return (
      <section className="section">
        <div className="container">
          <Link to={'admin/sentence-fragments/new'}>
            <button className="button is-primary">Create a New Sentence Fragment</button>
          </Link>
          <ArchivedButton
            showOnlyArchived={this.state.showOnlyArchived}
            toggleShowArchived={this.toggleShowArchived}
            lessons={false}
          />
          <p className="menu-label">Sentence Fragments</p>
          <QuestionList
            questions={sentenceFragments || []}
            showOnlyArchived={this.state.showOnlyArchived}
            basePath={'sentence-fragments'}
          />
        </div>
      </section>
    )
  }
}

function select(state) {
  return {
    sentenceFragments: state.sentenceFragments,
    routing: state.routing,
    lessons: state.lessons
  }
}

export default connect(select)(SentenceFragments)
