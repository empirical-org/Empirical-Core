import * as React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { Link } from 'react-router-dom'
import { QuestionList } from '../shared/questionList'
import { hashToCollection, } from '../../../Shared/index'

export interface ComponentProps {
  titleCards: any
  routing: any
  routeParams: any
}

class TitleCards extends React.Component<ComponentProps, any> {

  renderQuestionsList = () => {
    const { titleCards } = this.props
    const { data, hasreceiveddata } = titleCards

    const hashedTitleCards = hashToCollection(data)
    if (hasreceiveddata && hashedTitleCards) {
      return <QuestionList basePath='title-cards' questions={hashedTitleCards || []} />
    } else if (!hasreceiveddata) {
      return <p>Loading...</p>
    } else {
      return <p>No title cards yet</p>
    }
  }

  render() {
    return (
      <section className="section">
        <div className="admin-container">
          <Link to="/admin/title-cards/new">
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
