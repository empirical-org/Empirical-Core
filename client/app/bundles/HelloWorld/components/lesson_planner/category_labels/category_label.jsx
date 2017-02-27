'use strict'

 import React from 'react'

 export default  React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
    filterByCategory: React.PropTypes.func.isRequired,
    extraClassName: React.PropTypes.string
  },

  filterByCategory: function (e) {
    e.stopPropagation();
    this.props.filterByCategory(this.props.data.id);
  },

  generateClassName: function () {
    return ['category-label', 'img-rounded', this.props.extraClassName].join(' ')
  },

  render: function () {
    return (
      <div onClick={this.filterByCategory} className={this.generateClassName()}>{this.props.data.name.toUpperCase()}</div>
    )
  }
});
