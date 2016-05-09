'use strict'
EC.ResultsIcon = React.createClass({

    backgroundColor: function() {
      var color;
      var score = this.props.percentage;
      if (_.range(0,50).indexOf(score) > -1) {
        color = '#E7522C';
      } else if (_score.range(51,75).indexOf(score) > -1) {
        color = '#F6A625';
      } else {
        color = '#5AAF46';
      }
      return {backgroundColor: color};
    },

    imageSrc: function() {
      return this.props.activityType === 'sentence'
        ? '/images/grammar_results_icon.png'
        : '/images/grammar_results_icon.png'
    },

    render: function() {
      return <div className='icon' style={this.backgroundColor()}>
        <img src={this.imageSrc()} alt='activity-type'/>
        <h3>{this.props.percentage + '%'}</h3>

      </div>
    }

});
