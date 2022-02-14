import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { QuestionList } from '../shared/questionList';
import { hashToCollection } from '../../../Shared/index'

export interface ComponentProps {
  titleCards: any
  routing: any
  routeParams: any
  dispatch(any): void
}

class TitleCards extends React.Component<ComponentProps, any> {

  renderQuestionsList = () => {
    const formattedTitleCards = hashToCollection(this.props.titleCards.data);
    if (formattedTitleCards) {
      return <QuestionList basePath='title-cards' questions={formattedTitleCards || []} />
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
