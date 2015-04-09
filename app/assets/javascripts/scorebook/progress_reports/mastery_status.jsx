"use strict";

EC.MasteryStatus = React.createClass({
  propTypes: {
    score: React.PropTypes.number.isRequired
  },

  circleClass: function() {
    if (this.props.score > 0.75) {
      return 'circle proficient';
    } else if (this.props.score < 0.50) {
      return 'circle not-proficient';
    } else {
      return 'circle near-proficient';
    }
  },

  text: function() {
    if (this.props.score > 0.75) {
      return 'Proficient';
    } else if (this.props.score < 0.50) {
      return 'Not Proficient';
    } else if (this.props.score >= 0.50 && this.props.score <= 0.75) {
      return 'Nearly Proficient';
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