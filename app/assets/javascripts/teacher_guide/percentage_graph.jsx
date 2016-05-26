'use strict'
EC.PercentageGraph = React.createClass({
  propTypes: {
    percentage: React.PropTypes.number.isRequired
  },

  render: function() {
    return (
      <div className='circle-graph'>
      <div className={"c100 p" + this.props.percentage}>
      <span>{this.props.percentage + '%'}</span>
      <div className="slice">
        <div className="bar"></div>
        <div className="fill"></div>
      </div>
    </div>
  </div>)
  }



});
