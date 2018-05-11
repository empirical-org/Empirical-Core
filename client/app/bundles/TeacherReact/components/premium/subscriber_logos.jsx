import React from 'react'
export default React.createClass({

  mapLogos: function() {
    var logos = this.props.subscribers.map(function(subscriber, index) {
      return (
        <div className='logo-wrapper' key={index}>
          <img src={subscriber.source} alt={subscriber.name}/>
        </div>
      );
    });
    return logos;
  },

  render: function() {
    return (
      <div className='logo-group-wrapper'>
        {this.mapLogos()}
      </div>
    );
  }
});
