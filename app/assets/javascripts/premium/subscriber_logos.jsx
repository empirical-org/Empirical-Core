EC.SubscriberLogos = React.createClass({

  mapLogos: function() {
    var logos = this.props.subscribers.map(function(subsriber) {
      return (
        <div className='logo-wrapper'>
          <img src={subsriber.source} alt={subsriber.name}/>
        </div>
      );
    });
    return logos;
  },

  render: function() {
    console.log(this.props.clients);
    return (
      <div className='logo-group-wrapper'>
        {this.mapLogos()}
      </div>
    );
  }
});
