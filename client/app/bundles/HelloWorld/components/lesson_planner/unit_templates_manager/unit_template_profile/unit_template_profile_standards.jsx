'use strict'

 import React from 'react'
 import _ from 'underscore'
 
 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  getStandards: function () {
    return _.chain(this.props.data.model.activities)
            .map(_.property('topic'))
            .uniq(_.property('name'))
            .value()
  },

  getConcepts: function () {
    return _.uniq(_.map(this.getStandards(), function (standard) {
      return standard.topic_category.name
    }))
  },

  renderStandards: function (standards) {
    return _.map(standards, function(standard){
      return <dd>{standard.name}</dd>
    })
  },

  renderConcepts: function (concepts) {
    return _.map(concepts, function(concept){
      return <dd className='concept'>{concept}</dd>
    })
  },

  render: function () {
    return (
      <div className='standards-and-concepts light-gray-bordered-box'>
        <dl>
          <dt><strong>Standards</strong></dt>
          { this.renderStandards(this.getStandards()) }

          <dt className='concepts'><strong>Concepts</strong></dt>
          { this.renderConcepts(this.getConcepts()) }
        </dl>
      </div>
    )
  }
});
