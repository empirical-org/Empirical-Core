import React from 'react'

export default React.createClass({
  render: function() {
    return (
      <div>
        <p>Lessons</p>
        {this.props.children}
      </div>

    )
  }

})
