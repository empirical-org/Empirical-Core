'use strict'

import PropTypes from 'prop-types';

import React from 'react'
import {Link} from 'react-router'

export default class extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    extraClassName: PropTypes.string,
    isLink: PropTypes.bool
  };

  generateClassName = () => {
    return `category-label img-rounded ${this.props.extraClassName}`
  };

  getLink = () => {
    return this.props.nonAuthenticated
    ? `/activities/packs?category=${this.props.data.name.toLowerCase()}`
    : `/teachers/classrooms/assign_activities/featured-activity-packs?category=${this.props.data.name.toLowerCase()}`
  };

  render() {
    if (this.props.data.name) {
      const label = <div className={this.generateClassName()}>{this.props.data.name.toUpperCase()}</div>
      if (this.props.isLink) {
        return (
          <Link to={this.getLink()}>{label}</Link>
        )
      } else {
        return label
      }
    } else {
      return null
    }
  }
}
