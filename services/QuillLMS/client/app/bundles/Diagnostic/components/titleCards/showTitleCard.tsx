import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  TitleCard
} from '../../../Shared/index'

export interface ComponentProps {
  titleCards: any
  routing: any
  match: any
}
class ShowTitleCard extends React.Component<ComponentProps, any> {

  getTitleCard = () => {
    const { match, titleCards } = this.props;
    const { data } = titleCards;
    const { params } = match;
    const { titleCardID } = params;
    return data[titleCardID]
  }

  renderTitleCard = () => {
    const titleCard = this.getTitleCard()
    if (titleCard) {
      return <div><TitleCard html={this.getTitleCard().content} /></div>
    }
  }

  render() {
    const titleCard = this.getTitleCard()
    const { match } = this.props;
    const { params } = match;
    const { titleCardID } = params;
    return (
      <section className="section">
        <div className="container">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {titleCard ? <h1 style={{fontSize: '30px'}}>{titleCard.title}</h1> : <span />}
            <Link to={`/admin/title-cards/${titleCardID}/edit`}>
              <button className="button is-primary">Edit Title Card</button>
            </Link>
          </div>
          <hr />
          {this.renderTitleCard()}
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

export default connect(select)(ShowTitleCard)
