import React from 'react'
export default React.createClass({

  mapLogos: function() {
    var logos = this.props.subscribers.map(function(subscriber, index) {
      return (
        <div className='logo-wrapper' id={subscriber.id} key={index}>
          <img alt={subscriber.name} src={subscriber.source} id={subscriber.id} />
        </div>
      );
    });
    return logos;
  },

  render: function() {
    return (
      <div className='logo-group'>.
        <h2>Trusted by Some of the Best Schools</h2>
        <div className='logo-group-wrapper'>
          {this.mapLogos()}
        </div>
      </div>
    );
  }
});
