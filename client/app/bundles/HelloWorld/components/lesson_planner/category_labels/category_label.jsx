'use strict'

 import React from 'react'

 export default  React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
    extraClassName: React.PropTypes.string
  },

  generateClassName: function () {
    return ['category-label', 'img-rounded', this.props.extraClassName].join(' ')
  },

  getLink: function () {
    return this.props.nonAuthenticated
    ? `/activities/packs/category/${this.props.data.name.toLowerCase()}`
    : `/teachers/classrooms/activity_planner/featured-activity-packs/category/${this.props.data.name.toLowerCase()}`
  },

  render: function () {
    return (
      <a href={this.getLink()}><div className={this.generateClassName()}>{this.props.data.name.toUpperCase()}</div></a>
    )
  }
});
