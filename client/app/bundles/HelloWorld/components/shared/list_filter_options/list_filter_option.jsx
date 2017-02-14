'use strict'

 import React from 'react'
 import _ from 'underscore'

 export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    select: React.PropTypes.func.isRequired,
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
    const name = this.getName()
    if (name === 'All') {
      link = '/teachers/classrooms/activity_planner#/tab/featured-activity-packs'
    } else {
      link = `/teachers/classrooms/activity_planner#/tab/featured-activity-packs/category/${name}`
    }
    return link
  },

  render: function () {
    return (
      <a href={this.getLink()} className={this.getClassName()}>{this.getName()}</a>
    )
  }
})
