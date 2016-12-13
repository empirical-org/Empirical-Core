import React from 'react'

export default React.createClass({
  propTypes: {
    percentage: React.PropTypes.string,
    diagnostic: React.PropTypes.bool
  },


  render: function () {
    let message;
    if (this.props.diagnostic) {
      message = <span>100% Complete</span>
    } else {
      message = <span>Total Score: <span className='percentage'>{this.props.percentage}</span></span>
    }
    return (
      <div className='total-score'>
        {message}
      </div>
    );
  }
});
