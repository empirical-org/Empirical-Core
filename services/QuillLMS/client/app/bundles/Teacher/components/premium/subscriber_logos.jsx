import React from 'react';
export default class SubscriberLogos extends React.Component {
  mapLogos = () => {
    const { subscribers, } = this.props
    const logos = subscribers.map(function(subscriber, index) {
      return (
        <div className='logo-wrapper' id={subscriber.id} key={index}>
          <img alt={subscriber.name} id={subscriber.id} src={subscriber.source}  />
        </div>
      );
    });
    return logos;
  };

  render() {
    return (
      <div className='logo-group container'>
        <h3>Trusted by some of the best schools</h3>
        <div className='logo-group-wrapper'>
          {this.mapLogos()}
        </div>
      </div>
    );
  }
}
