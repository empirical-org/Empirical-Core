import React from 'react'

export default React.createClass({
  render: function() {
    return (
      <section className="section">
        <div className="container">
          {this.props.children}
        </div>
      </section>
    )
  }
});
