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
    var state = this.state;
    state[key] = value;
    this.setState(state);
  },

  update: function (hash) {
    var state = this.state;
    state = _.merge(state, hash);
    this.setState(state);
  },

  signUp: function () {
    $.ajax({
      type: 'POST',
      url: '/account',
      data: this.signUpData(),
      success: this.uponSignUp,
      error: this.signUpError
    });
  },

  signUpError: function (xhr) {
    var errors = $.parseJSON(xhr.responseText).errors;
    this.setState({errors: errors});
  },

  signUpData: function () {
    var data = {
      role: this.state.role,
      name: this.determineNameInput(),
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };
    if (this.state.role === 'teacher') {
      data.send_newsletter = this.state.sendNewsletter;
    }
    return {user: data};
  },

  determineNameInput: function () {
    var name;
    var that = this;
    name = _.reduce([this.state.first_name, this.state.last_name], function (memo, current) {
      var nextMemo;
      if (!that.existy(memo)) {
        nextMemo = current;
      } else if (!that.existy(current)) {
        nextMemo = memo;
      } else {
        nextMemo = memo + ' ' + current;
      }
      return nextMemo;
    }, null, this);
    return name;
  },

  existy: function (item) {
    return !( (item === null) || (item === undefined) || (item === '') );
  },

  uponSignUp: function (data) {
    if (this.state.role === 'student') {
      window.location = "/profile";
    } else if (this.state.role === 'teacher') {
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
                              update={this.update}
                              signUp={this.signUp}
                              errors={this.state.errors}/>;
      } else {
        view = <NewTeacher textInputGenerator={this.modules.textInputGenerator}
                              sendNewsletter={this.state.sendNewsletter}
                              stage={this.state.teacherStage}
                              update={this.update}
                              signUp={this.signUp}
                              errors={this.state.errors}
                              analytics={this.state.analytics}/>;
      }
    }
    return <div className='container account-form' id='sign-up'>{view}</div>;
  }
});
