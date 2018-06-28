import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'
import { hashToCollection } from 'quill-component-library/dist/componentLibrary'
import { ArchivedButton } from 'quill-component-library/dist/componentLibrary'
import { getNonDiagnosticQuestions } from '../../libs/getNonDiagnosticQuestions'
import { QuestionList } from 'quill-component-library/dist/componentLibrary';

class SentenceFragments extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showOnlyArchived: false,
      questions: {}
    }

    this.toggleShowArchived = this.toggleShowArchived.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { sentenceFragments, diagnosticLessons } = nextProps
    if (sentenceFragments.hasreceiveddata && diagnosticLessons.hasreceiveddata) {
      if (Object.keys(this.state.questions).length === 0 || !_.isEqual(this.props.sentenceFragments.data, sentenceFragments.data) || (!_.isEqual(this.props.diagnosticLessons.data, diagnosticLessons.data))) {
        this.setState({ questions: getNonDiagnosticQuestions(diagnosticLessons.data, sentenceFragments.data) })
      }
    }
  }

  toggleShowArchived() {
    this.setState({
      showOnlyArchived: !this.state.showOnlyArchived,
    });
  }

  render() {
    const sentenceFragments = hashToCollection(this.state.questions)
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
    diagnosticLessons: state.diagnosticLessons
  }
}

export default connect(select)(SentenceFragments)
