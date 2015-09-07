'use strict';
EC.ConceptResultStat = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    correct: React.PropTypes.number.isRequired,
    incorrect: React.PropTypes.number.isRequired
  },

  render: function () {
    return (
      <div className='row'>
        <div className='col-xs-8 col-sm-8 col-xl-8'>{this.props.name}</div>
        <div className='col-xs-2 col-sm-2 col-xl-2 correct-answer'>{this.props.correct}</div>
        <div className='col-xs-2 col-sm-2 col-xl-2 incorrect-answer'>{this.props.incorrect}</div>
      </div>
    );
  }
});