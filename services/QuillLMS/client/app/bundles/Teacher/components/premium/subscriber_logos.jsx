import React from 'react'
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
        <h2>Trusted by Some of the Best Schools</h2>
        <div className='logo-group-wrapper'>
          {this.mapLogos()}
        </div>
      </div>
    );
  }
}
