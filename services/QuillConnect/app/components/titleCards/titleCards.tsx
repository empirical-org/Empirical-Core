import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { Link } from 'react-router'
import Modal from '../modal/modal.jsx'
import {hashToCollection} from '../../libs/hashToCollection'
import QuestionsList from './titleCardsList.jsx'
import ArchivedButton from '../shared/archivedButton.jsx'

class TitleCards extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.titleCards.hasreceiveddata) {
      const titleCards = hashToCollection(this.props.titleCards.data)
      return (
        <section className="section">
          <div className="container">
            <Link to={'admin/title-cards/new'}>
              <button className="button is-primary">Create a New Title Card</button>
            </Link>
            <p className="menu-label">Title Cards</p>
            <QuestionsList titleCards={titleCards || []} showOnlyArchived={this.state.showOnlyArchived}/>
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
    titleCards: state.titleCards,
    routing: state.routing
  }
}

export default connect(select)(TitleCards)
