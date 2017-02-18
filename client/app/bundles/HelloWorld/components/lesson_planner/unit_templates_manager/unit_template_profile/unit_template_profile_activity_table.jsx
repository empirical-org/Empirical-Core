'use strict'

 import React from 'react'

 export default  React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
  },

  renderActivities: function() {
    return this.props.data.model.activities.map(function(act){
      return (
        <tr>
          <td>
            <div className={act.classification.image_class}></div>
          </td>
          <td>
            {act.name}
          </td>
          <td>
            {act.topic.topic_category.name}
          </td>
          <td>
            <a href={act.anonymous_path} target="_blank" className="button-green full-width preview-button">Preview Activity</a>
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
