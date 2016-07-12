import React from 'react'

export default React.createClass({
  propTypes: {
    percentage: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      <div className='total-score'>
        Total Score: <span className='percentage'>{this.props.percentage}</span>
      </div>
    );
  }
});
