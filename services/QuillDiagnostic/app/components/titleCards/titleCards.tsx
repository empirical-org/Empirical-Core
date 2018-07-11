import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { Link } from 'react-router'
import { QuestionList, hashToCollection } from 'quill-component-library/dist/componentLibrary'

class TitleCards extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.renderQuestionsList = this.renderQuestionsList.bind(this)
  }

  renderQuestionsList() {
    const titleCards = hashToCollection(this.props.titleCards.data)
    if (this.props.titleCards.hasreceiveddata && titleCards) {
      return <QuestionList questions={titleCards || []} basePath='title-cards'/>
    } else if (!this.props.titleCards.hasreceiveddata) {
      return <p>Loading...</p>
    } else {
      return <p>No title cards yet</p>
    }
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <Link to={'admin/title-cards/new'}>
            <button className="button is-primary">Create a New Title Card</button>
          </Link>
          <p className="menu-label">Title Cards</p>
          {this.renderQuestionsList()}
        </div>
      </section>
    )
  }
}

function select(state) {
  return {
    titleCards: state.titleCards,
    routing: state.routing
  }
}

export default connect(select)(TitleCards)
