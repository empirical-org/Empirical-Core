import React from 'react'

export default React.createClass({


  componentDidMount: function () {
    this.props.saveToLMS()
  },

  renderSavedIndicator: function () {
    if (this.props.saved) {
      return (
        <div>
          Saved Diagnostic
        </div>
      )
    } else {
      return (
        <div>
          Saving Diagnostic
        </div>
      )
    }
  },

  render: function () {
    return (
      <div className="container">
        Finished Diagnostic
      </div>
    )
  },

})
