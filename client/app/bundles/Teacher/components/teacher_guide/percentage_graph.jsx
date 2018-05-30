'use strict'
import React from 'react'

export default React.createClass({
  propTypes: {
    percentage: React.PropTypes.number.isRequired
  },
  goToTeacherGuide: function(){
    window.location="/teachers/teacher_guide";
  },

  render: function() {
    return (
      <div className='circle-graph'>
      <div className={"c100 p" + this.props.percentage}>
      <span onClick={this.goToTeacherGuide}>{this.props.percentage + '%'}</span>
      <div className="slice">
        <div className="bar"></div>
        <div className="fill"></div>
      </div>
    </div>
  </div>)
  }



});
