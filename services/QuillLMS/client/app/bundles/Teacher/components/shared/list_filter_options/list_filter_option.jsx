import React from 'react'
import { Link } from 'react-router'
import _ from 'underscore'

export default class ListFilterOption extends React.Component {
  constructor(props) {
    super(props)
  }
  
  getName() {
    return this.props.data.name;
  }

  getId() {
    return this.props.data.id;
  }

  select() {
    this.props.select(this.getId());
  }

  getClassName() {
    let name;
    if (this.props.isSelected) {
      name = 'list-filter-option selected active'
    } else {
      name = 'list-filter-option'
    }
    return name;
  }

  getLink() {
    let link
    const name = this.getName().toLowerCase()
    if (this.props.userLoggedIn) {
      link = '/teachers/classrooms/assign_activities'
      if (name === 'all') {
        link += '/featured-activity-packs'
      } else {
        link += `/featured-activity-packs?category=${name}`
      }
    } else {
      if (name === 'all') {
        link = '/activities/packs'
      } else {
        link = `/activities/packs?category=${name}`
      }
    }
    return link
  }

  render() {
    return (
      <Link to={this.getLink()} className={this.getClassName()}>{this.getName()}</Link>
    )
  }
}
