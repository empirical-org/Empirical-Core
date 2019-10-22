import React from 'react'
import {connect} from 'react-redux'
import { Link } from 'react-router'
import {
  hashToCollection,
  ArchivedButton,
  QuestionList
} from 'quill-component-library/dist/componentLibrary'

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
    const { sentenceFragments } = nextProps
    if (sentenceFragments.hasreceiveddata) {
      if (Object.keys(this.state.questions).length === 0 || !_.isEqual(this.props.sentenceFragments.data, sentenceFragments.data)) {
        this.setState({ questions: sentenceFragments.data })
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
            lessons={false}
            showOnlyArchived={this.state.showOnlyArchived}
            toggleShowArchived={this.toggleShowArchived}
          />
          <p className="menu-label">Sentence Fragments</p>
          <QuestionList
            basePath={'sentence-fragments'}
            questions={sentenceFragments || []}
            showOnlyArchived={this.state.showOnlyArchived}
          />
        </div>
      </section>
    )
  }
}

function select(state) {
  return {
    sentenceFragments: state.sentenceFragments,
    routing: state.routing
  }
}

export default connect(select)(SentenceFragments)
