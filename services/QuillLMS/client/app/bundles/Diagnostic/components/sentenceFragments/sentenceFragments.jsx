import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { ArchivedButton, hashToCollection } from '../../../Shared/index'
import { QuestionList } from '../shared/questionList'

class SentenceFragments extends React.Component {
  constructor(props) {
    super(props)

    const { sentenceFragments } = props

    this.state = {
      showOnlyArchived: false,
      diagnosticQuestions: sentenceFragments.data ? sentenceFragments.data : null
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { diagnosticQuestions } = this.state;
    const { sentenceFragments, lessons } = nextProps
    if (sentenceFragments.hasreceiveddata && lessons.hasreceiveddata) {
      if (Object.keys(diagnosticQuestions).length === 0 || !_.isEqual(this.props.sentenceFragments.data, sentenceFragments.data) || (!_.isEqual(this.props.lessons.data, lessons.data))) {
        this.setState({ diagnosticQuestions: sentenceFragments.data })
      }
    }
  }

  toggleShowArchived = () => {
    const { showOnlyArchived } = this.state;
    this.setState({
      showOnlyArchived: !showOnlyArchived,
    });
  };

  render() {
    const { diagnosticQuestions, showOnlyArchived } = this.state;
    const sentenceFragments = hashToCollection(diagnosticQuestions)
    return (
      <section className="section">
        <div className="container">
          <Link to="/admin/sentence-fragments/new">
            <button className="button is-primary">Create a New Sentence Fragment</button>
          </Link>
          <ArchivedButton
            lessons={false}
            showOnlyArchived={showOnlyArchived}
            toggleShowArchived={this.toggleShowArchived}
          />
          <p className="menu-label">Sentence Fragments</p>
          <QuestionList
            basePath="sentence-fragments"
            questions={sentenceFragments || []}
            showOnlyArchived={showOnlyArchived}
          />
        </div>
      </section>
    )
  }
}

function select(state) {
  return {
    sentenceFragments: state.sentenceFragments,
    questions: state.questions,
    routing: state.routing,
    lessons: state.lessons,
  }
}

export default connect(select)(SentenceFragments)
