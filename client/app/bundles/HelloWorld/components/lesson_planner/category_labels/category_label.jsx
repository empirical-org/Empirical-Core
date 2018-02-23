'use strict'

 import React from 'react'
 import createReactClass from 'create-react-class'
 import PropTypes from 'prop-types'
 import {Link} from 'react-router'

 export default  createReactClass({

  propTypes: {
    data: PropTypes.object.isRequired,
    extraClassName: PropTypes.string,
    isLink: PropTypes.bool
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
