EC.TotalScore = React.createClass({
  propTypes: {
    percentage: React.PropTypes.number.isRequired
  },

  render: function () {
    return (
      <div className='total-score'>
        Total Score: <span className='percentage'>{this.props.percentage}</span>
      </div>
    );
  }
});