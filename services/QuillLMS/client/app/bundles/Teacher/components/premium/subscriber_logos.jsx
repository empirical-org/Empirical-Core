import React from 'react'
export default class extends React.Component {
  mapLogos = () => {
    var logos = this.props.subscribers.map(function(subscriber, index) {
      return (
        <div className='logo-wrapper' key={index}>
          <img alt={subscriber.name} src={subscriber.source} />
        </div>
      );
    });
    return logos;
  };

  render() {
    return (
      <div className='logo-group-wrapper'>
        {this.mapLogos()}
      </div>
    );
  }
}
