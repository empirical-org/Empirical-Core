'use strict';
import React from 'react'
import $ from 'jquery'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import NewAccountStage1 from './new_account_stage1'
import NewStudent from './new_student'
import NewAccount from './new_account'
import NewTeacher from './new_teacher'
import TextInputGenerator from '../../modules/componentGenerators/text_input_generator'
import _ from 'lodash'



export default React.createClass({
  propTypes: {
    teacherFromGoogleSignUp: React.PropTypes.bool.isRequired
  },

  getInitialState: function () {
    this.modules = {
      textInputGenerator: new TextInputGenerator(this, this.updateKeyValue)
    };

    var hash, subHash;
    hash = {
      first_name: null,
      last_name: null,
      username: null,
      email: null,
      password: null,
      password_confirmation: null,
      errors: {},
      sendNewsletter: true,
      analytics: new AnalyticsWrapper()
    };

    if (this.props.teacherFromGoogleSignUp) {
      subHash = {
        role: 'teacher',
        stage: 2,
        teacherStage: 2
      };
    } else {
      subHash = {
        role: null,
        stage: 1,
        teacherStage: 1
      };
    }
    hash = _.merge(hash, subHash)
    return hash;
  },

  selectRole: function (role) {
    var that = this;
    $.ajax({
      type: 'POST',
      url: '/account/role',
      data: {
        role: role,
        authenticity_token: $('meta[name=csrf-token]').attr('content')
      },
      success: function () {
        that.setState({role: role});
        that.setState({stage: 2});
      }
    });
  },

  updateKeyValue: function (key, value) {
    const newState = Object.assign({}, this.state);
    newState[key] = value;
    this.setState(newState);
  },

  update: function (hash) {
    const stateCopy = Object.assign({}, this.state);
    const newState = _.merge(stateCopy, hash);
    this.setState(newState);
  },

  signUp: function () {
    if (this.state.first_name && this.state.last_name) {
      $.ajax({
        type: 'POST',
        url: '/account',
        data: this.signUpData(),
        success: this.uponSignUp,
        error: this.signUpError
      });
    } else {
      const errors = {}
      if (!this.state.first_name) {
        errors['first_name'] = "can't be blank"
      }
      if (!this.state.last_name) {
        errors['last_name'] = "can't be blank"
      }
      this.setState({errors})
    }
  },

  signUpError: function (xhr) {
    var errors = $.parseJSON(xhr.responseText).errors;
    this.setState({errors: errors});
  },

  signUpData: function () {
    const name = this.state.first_name + ' ' + this.state.last_name
    const data = {
      role: this.state.role,
      name,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };
    if (this.state.role === 'teacher') {
      data.send_newsletter = this.state.sendNewsletter;
    }
    return {user: data};
  },

  uponSignUp: function (data) {
    let analytics = new AnalyticsWrapper()
    if (data.redirectPath) {
      window.location = data.redirectPath;
    } else if (this.state.role === 'student') {
      window.location = '/profile';
      analytics.track('Student created an account')
    } else if (this.state.role === 'teacher') {
      analytics.track('Teacher created an account')
      this.setState({teacherStage: 2});
    }
  },

  initializeTextInputGenerator: function () {
    this.modules.textInputGenerator.setErrors(this.state.errors);
  },

  render: function () {
    var view;
    this.initializeTextInputGenerator();
    if (this.state.stage === 1) {
      view = <NewAccountStage1 selectRole={this.selectRole} />;
    } else if (this.state.stage === 2) {
      if (this.state.role === 'student') {
        view = <NewStudent textInputGenerator={this.modules.textInputGenerator}
                              updateKeyValue={this.updateKeyValue}
                              signUp={this.signUp}
                              errors={this.state.errors}/>;
      } else {
        view = <NewTeacher textInputGenerator={this.modules.textInputGenerator}
                              sendNewsletter={this.state.sendNewsletter}
                              stage={this.state.teacherStage}
                              updateKeyValue={this.updateKeyValue}
                              signUp={this.signUp}
                              errors={this.state.errors}
                              analytics={this.state.analytics}
                              teacherFromGoogleSignUp={this.props.teacherFromGoogleSignUp}
                              />;
      }
    }
    return <div className='container account-form' id='sign-up'>{view}</div>;
  }
});
