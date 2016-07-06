'use strict'
import React from 'react'

export default React.createClass({

   getInitialState: function(){
     return {scoreColor: this.scoreColor()}
   },

   scoreColor: function(){
       var score = this.props.percentage;
       var color;
       if ((score >= 0) && (score <= 0.5)) {
         color = 'red';
       } else if ((score >= 0.51) && (score <= 0.75)) {
         color = 'yellow';
       } else {
         color = 'green';
       }
       return color;
     },

    backgroundColor: function() {
      var scoreColor = this.state.scoreColor;
      var color;
      if (scoreColor === 'red') {
        color = '#E7522C';
      } else if (scoreColor === 'yellow') {
        color = '#F6A625';
      } else {
        color = '#5AAF46';
      }
      return {backgroundColor: color};
    },

    fontColor: function() {
      var scoreColor = this.state.scoreColor;
      var color;
      if (scoreColor === 'red') {
        color = '#82290D';
      } else if (scoreColor === 'yellow') {
        color = '#79500E';
      } else {
        color = '#305217';
      }
      return {color: color};
    },

    imageSrc: function() {
      return this.props.activityType === 'sentence'
        ? '/images/grammar_results_icon.png'
        : '/images/grammar_results_icon.png'
    },

    render: function() {
      return <div className='icon' style={this.backgroundColor()}>
        <img src={this.imageSrc()} alt='activity-type'/>
        <h3 style={this.fontColor()}>{Math.round(this.props.percentage * 100) + '%'}</h3>
      </div>
    }

});
