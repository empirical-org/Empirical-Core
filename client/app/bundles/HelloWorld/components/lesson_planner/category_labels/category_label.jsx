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

  render: function () {
    return (
      <a href={`/teachers/classrooms/activity_planner#/tab/featured-activity-packs/category/${this.props.data.name}`}><div className={this.generateClassName()}>{this.props.data.name.toUpperCase()}</div></a>
    )
  }
});
