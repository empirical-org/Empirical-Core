'use strict'
EC.PercentageGraph = React.createClass({
  propTypes: {
    percentage: React.PropTypes.number.isRequired
  },

  render: function() {
    alert('working')
    return (
      <div className='circle-graph'>
      <div class="c100 p25">
      <span>25%</span>
      <div class="slice">
        <div class="bar"></div>
        <div class="fill"></div>
      </div>
    </div>
  </div>)
  }



});
