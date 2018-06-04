import React from 'react'
import Spinner from '../shared/spinner.jsx'
export default React.createClass({

  componentDidMount: function () {
    this.props.saveToLMS()
  },

  render: function () {
    return (
      <div className="landing-page">
        <h1>You've completed the Quill Placement Activity </h1>
        <p>
          Your unique code is ij3982rmf9.
        </p>
      </div>
    )
  },

})
