'use strict'

 import React from 'react'
 import {Link} from 'react-router'

 export default  React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
    extraClassName: React.PropTypes.string,
    isLink: React.PropTypes.bool
  },

  generateClassName: function () {
    return `category-label img-rounded ${this.props.extraClassName}`
  },

  getLink: function () {
    return this.props.nonAuthenticated
    ? `/activities/packs/category/${this.props.data.name.toLowerCase()}`
    : `/teachers/classrooms/assign_activities/featured-activity-packs/category/${this.props.data.name.toLowerCase()}`
  },

  render: function () {
    const label = <div className={this.generateClassName()}>{this.props.data.name.toUpperCase()}</div>
    if (this.props.isLink) {
      return (
        <Link to={this.getLink()}>{label}</Link>
      )
    } else {
      return label
    }
  }
});
