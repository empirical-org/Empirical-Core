'use strict'

 import React from 'react'
 import { Link } from 'react-router'
 import _ from 'underscore'

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    isSelected: React.PropTypes.bool.isRequired,
  },

  getName: function () {
    return this.props.data.name;
  },

  getId: function () {
    return this.props.data.id;
  },

  select: function () {
    this.props.select(this.getId());
  },

  getClassName: function () {
    var name;
    if (this.props.isSelected) {
      name = 'list-filter-option selected active'
    } else {
      name = 'list-filter-option'
    }
    return name;
  },

  getLink: function() {
    let link
    const name = this.getName().toLowerCase()
    if (this.props.userLoggedIn) {
      link = '/teachers/classrooms/assign_activities'
      if (name === 'all') {
        link += '/featured-activity-packs'
      } else {
        link += `/featured-activity-packs/category/${name}`
      }
    } else {
      if (name === 'all') {
        link = '/activities/packs'
      } else {
        link = `/activities/packs/category/${name}`
      }
    }
    return link
  },

  render: function () {
    return (
      <Link to={this.getLink()} className={this.getClassName()}>{this.getName()}</Link>
    )
  }
})
