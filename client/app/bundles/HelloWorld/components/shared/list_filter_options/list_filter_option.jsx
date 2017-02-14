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

  render: function () {
    return (
      <a href={`/teachers/classrooms/activity_planner#/tab/featured-activity-packs/${this.getName()}`} className={this.getClassName()}>{this.getName()}</a>
    )
  }
})
