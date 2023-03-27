import React from 'react'
import { connect } from 'react-redux'
import { ArchivedButton, hashToCollection } from '../../../Shared/index'
import { QuestionList } from '../shared/questionList'

class SentenceFragments extends React.Component {
  constructor(props) {
    super(props)

    const { sentenceFragments } = props
    const { data } = sentenceFragments

    this.state = {
      showOnlyArchived: false,
      questions: data || {}
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { questions } = this.state
    const { sentenceFragments } = nextProps
    const { data, hasreceiveddata } = sentenceFragments
    if (hasreceiveddata) {
      if (Object.keys(questions).length === 0 || !_.isEqual(this.props.sentenceFragments.data, data)) {
        this.setState({ questions: data })
      }
    }
  }

  toggleShowArchived = () => {
    this.setState(prevState => ({ showOnlyArchived: !prevState.showOnlyArchived }))
  }

  render() {
    const { questions, showOnlyArchived } = this.state
    const sentenceFragments = hashToCollection(questions)
    return (
      <section className="section">
        <div className="container">
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
    routing: state.routing
  }
}

export default connect(select)(SentenceFragments)
