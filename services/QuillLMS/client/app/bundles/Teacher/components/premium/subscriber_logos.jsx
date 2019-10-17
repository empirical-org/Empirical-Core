import React from 'react'
export default React.createClass({

  mapLogos: function() {
    var logos = this.props.subscribers.map(function(subscriber, index) {
      return (
        <div className='logo-wrapper' key={index}>
          <img alt={subscriber.name} src={subscriber.source}/>
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
