"use strict";
import React from 'react'
export default React.createClass({
  propTypes: {
    score: React.PropTypes.number.isRequired
  },

  circleClass: function() {
    if (this.props.score > 0.75) {
      return 'circle proficient';
    } else {
      return 'circle not-proficient';
    }
  },

  text: function() {
    if (this.props.score > 0.75) {
      return 'Proficient';
    } else if (this.props.score <= 0.75) {
      return 'Not Yet Proficient';
    }
  },

  render: function() {
    return (
      <div>
        <div className={this.circleClass()}></div>
        <span>{this.text()}</span>
      </div>
    );
  }
});
