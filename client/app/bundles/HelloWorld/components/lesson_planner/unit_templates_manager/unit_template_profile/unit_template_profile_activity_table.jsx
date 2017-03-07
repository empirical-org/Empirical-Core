'use strict'

 import React from 'react'

 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object,
    actions: React.PropTypes.object
  },

  findImageClass: function(key) {
    let image
    switch (key) {
      case 'passage':
        image = 'flag'
        break
      case 'sentence':
        image = 'puzzle'
        break
      default:
        image = key
    }
    return `icon-${image}-gray`
  },

  findAnonymousPath: function(id) {
    return `/activity_sessions/anonymous?activity_id=${id}`
  },

  renderActivities: function() {
    const that = this
    return this.props.data.activities.map(function(act){
      return (
        <tr key={act.id}>
          <td>
            <div className={that.findImageClass(act.classification.key)}></div>
          </td>
          <td>
            {act.name}
          </td>
          <td>
            {act.topic.topic_category.name}
          </td>
          <td>
            <a href={that.findAnonymousPath(act.id)} target="_blank" className="button-green full-width preview-button">Preview Activity</a>
          </td>
        </tr>
      )
    })
  },

  render: function () {
    return (
      <table className='table activity-table activity-pack'>
        <thead>
          <tr>
          <th>App</th>
          <th>Activity</th>
          <th>Concept</th>
          <th></th>
          </tr>
        </thead>
        <tbody>
          {this.renderActivities()}
        </tbody>
      </table>
    )
  }
});
