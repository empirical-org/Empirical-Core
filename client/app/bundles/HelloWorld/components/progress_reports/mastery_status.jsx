'use strict';
import React from 'react'
import cutOff from '../../../../modules/proficiency_cutoffs.js'
export default React.createClass({
  propTypes: {
    score: React.PropTypes.number.isRequired
  },

  circleClass: function() {
    if (this.props.score > cutOff.proficient) {
      return 'circle proficient';
    } else {
      return 'circle not-proficient';
    }
  },

  text: function() {
    if (this.props.score > cutOff.proficient) {
      return 'Proficient';
    } else {
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
