'use strict';
import React from 'react'

export default React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    correct: React.PropTypes.number.isRequired,
    incorrect: React.PropTypes.number.isRequired
  },

  render: function () {
    return (
      <div className='row'>
        <div className='col-xs-8 no-pl'>{this.props.name}</div>
        <div className='col-xs-2 correct-answer'>{this.props.correct}</div>
        <div className='col-xs-2 no-pr incorrect-answer'>{this.props.incorrect}</div>
      </div>
    );
  }
});
