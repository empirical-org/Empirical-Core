import React from 'react';
import LinkListItem from '../shared/linkListItem.jsx'

export default class TitleCardsList extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.renderListItems = this.renderListItems.bind(this)
  }

  renderListItems() {
    const questions = this.props.titleCards;
    if (questions.length === 0) {
      return;
    }
    return questions.map((titleCard) => {
      return (
        <LinkListItem
          key={titleCard.key}
          itemKey={titleCard.key}
          text={titleCard.title}
          basePath="title-cards"
        />
      )
    })
  }

  render() {
    return (
      <ul className="menu-list">
        {this.renderListItems()}
      </ul>
    )
  }
}
