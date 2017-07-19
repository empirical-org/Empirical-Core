'use strict';

import React from 'react'
import BasicTeacherInfo from './basic_teacher_info'
import EducatorType from './educator_type'
import AnalyticsWrapper from '../../shared/analytics_wrapper'

export default React.createClass({
  render: function () {
    if (this.props.stage === 1) {
      return (
        <BasicTeacherInfo errors={this.props.errors} signUp={this.props.signUp} updateKeyValue={this.props.updateKeyValue} sendNewsletter={this.props.sendNewsletter} />
      )
    } else if (this.props.stage === 2) {
      return (
        <EducatorType teacherFromGoogleSignUp={this.props.teacherFromGoogleSignUp} analytics={new AnalyticsWrapper()}/>
      )
    }
  }
});
