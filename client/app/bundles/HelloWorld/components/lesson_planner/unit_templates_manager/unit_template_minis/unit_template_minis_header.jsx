'use strict'

 import React from 'react'
 import $ from 'jquery'
 import SuffixBuilder from '../../../modules/numberSuffixBuilder.js'

 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  componentDidMount: function() {
    $('.activities-nav-tab').addClass('active');
  },

  stateSpecificComponent: function () {
    var grade = this.props.data.grade;
    if (grade && grade.toLowerCase() !== 'university'.toLowerCase()) {
      return `Great Activity Packs for Your ${SuffixBuilder(grade)} Grade Class`;
    } else if (grade && grade.toLowerCase() === 'university'.toLowerCase()) {
      return 'Great Activity Packs for Your University Class'
    } else {
      return 'Featured Activity Packs';
    }
  },

  render: function () {
    return (
      <div className='unit-template-minis-header'>
        <h1>{this.stateSpecificComponent()}</h1>
        <h3>Activity Packs are a simple way to assign a group of activities to students quickly. More time teaching, less time clicking.</h3>
      </div>
    )
  }
})
