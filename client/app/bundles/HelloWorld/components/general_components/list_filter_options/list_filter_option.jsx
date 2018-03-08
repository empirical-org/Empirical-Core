'use strict'

 import React from 'react'
 import createReactClass from 'create-react-class'
 import PropTypes from 'prop-types'
 
 export default  createReactClass({
  propTypes: {
    data: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
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
      name = 'list-filter-option selected'
    } else {
      name = 'list-filter-option'
    }
    return name;
  },

  render: function () {
    return (
      <a className={this.getClassName()} onClick={this.select}>{this.getName()}</a>
    )
  }
})
