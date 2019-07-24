import React from 'react'

export default React.createClass({

  stateSpecificComponents: function() {
    if (this.props.status == 'trial') {
      return (
          <h4>You have {this.props.data} days left in your trial.</h4>
      );
    } else if (this.props.status == 'locked') {
      return (
          <h4>Your Premium Trial Has Expired</h4>
      );
    }
  },

  render: function() {
    return (
      <div className='row'>
        <div className='col-md-9 col-xs-12 pull-left'>
          {this.stateSpecificComponents()}
          <span>Getting value out of Premium? <a href='/premium'>Check out our pricing plans.</a></span>
        </div>
        <div className='col-md-3 col-xs-12 pull-right'>
          <div className='premium-button-box text-center'>
            <a href='/premium'>
              <button type='button' className='btn-orange'>Upgrade to Premium Now</button>
            </a>
          </div>
        </div>
      </div>
    );
  }

});
