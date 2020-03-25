import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { hashToCollection } from 'quill-component-library/dist/componentLibrary'
import { QuestionList } from '../shared/questionList';
export interface ComponentProps {
  titleCards: any
  routing: any
  routeParams: any 
  dispatch(any): void
}

class TitleCards extends React.Component<ComponentProps, any> {
  constructor(props) {
    super(props)

    this.renderQuestionsList = this.renderQuestionsList.bind(this)
  }

  renderQuestionsList() {
    const { titleCards } = this.props;
    const { data, hasreceiveddata } = titleCards;
    const transformedTitleCards = hashToCollection(data)
    if (hasreceiveddata && transformedTitleCards) {
      return <QuestionList basePath='title-cards' questions={transformedTitleCards || []} />
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
          <Link to={'/admin/title-cards/new'}>
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
