import React from 'react'
import _ from 'underscore'

export default React.createClass({

  renderSentenceFragments: function () {
    return (
      <div className="draft-js sentence-fragments prevent-selection" dangerouslySetInnerHTML={{__html: this.props.getQuestion().prompt}}></div>
    )
  },

  render: function() {
    return this.renderSentenceFragments()
  }
})
