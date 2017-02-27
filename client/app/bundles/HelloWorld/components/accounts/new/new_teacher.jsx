'use strict';

import React from 'react'
import BasicTeacherInfo from './basic_teacher_info'
import EducatorType from './educator_type'
import AnalyticsWrapper from '../../shared/analytics_wrapper'

export default React.createClass({
  propTypes: {
    signUp: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object,
    stage: React.PropTypes.number.isRequired,
    update: React.PropTypes.func.isRequired,
    textInputGenerator: React.PropTypes.object.isRequired
  },


  render: function () {
    if (this.props.stage === 1) {
      return (
        <BasicTeacherInfo textInputGenerator={this.props.textInputGenerator} signUp={this.props.signUp} update={this.props.update}/>
      )
    } else if (this.props.stage === 2) {
      return (
        <EducatorType analytics={new AnalyticsWrapper()}/>
      )
    }
  }
});
