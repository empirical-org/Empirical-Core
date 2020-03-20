'use strict'
import PropTypes from 'prop-types';
import React from 'react'

export default class extends React.Component {
  static propTypes = {
    percentage: PropTypes.number.isRequired
  };

  goToTeacherGuide = () => {
    window.location="/teachers/teacher_guide";
  };

  render() {
    return (
      <div className='circle-graph'>
        <div className={"c100 p" + this.props.percentage}>
          <span onClick={this.goToTeacherGuide}>{this.props.percentage + '%'}</span>
          <div className="slice">
            <div className="bar" />
            <div className="fill" />
          </div>
        </div>
      </div>)
  }
}
