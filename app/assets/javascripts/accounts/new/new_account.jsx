'use strict';
$(function () {
  var ele = $('#sign-up');
  if (ele.length) {
    var teacherFromGoogleSignUp = ele.data('teacher-from-google-sign-up');
    var props = {teacherFromGoogleSignUp: teacherFromGoogleSignUp,
                 analytics: new EC.AnalyticsWrapper()};
    React.render(React.createElement(EC.NewAccount, props), ele[0]);
  }
});

EC.NewAccount = React.createClass({

  getInitialState: function () {
    var hash, subHash;
    hash = {
      first_name: null,
      last_name: null,
      username: null,
      email: null,
      password: null,
      password_confirmation: null,
      errors: {},
      sendNewsletter: true
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
    this.props.analytics.track('select role', {role: role});

    var authenticityToken = $('meta[name=csrf-token]').attr('content');
    var that = this;
    $.ajax({
      type: 'POST',
      url: '/account/role',
      data: {
        role: role,
        authenticity_token: authenticityToken
      },
      success: function () {
        that.setState({role: role});
        that.setState({stage: 2});
      }
    });
  },

  update: function (hash) {
    var state = this.state;
    state = _.merge(state, hash)
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
      name: this.state.first_name + ' ' + this.state.last_name,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };
    if (this.state.role === 'teacher') {
      data.newsletter = (this.state.sendNewsletter === 'checked');
    }
    return {user: data};
  },

  uponSignUp: function (data) {
    if (this.state.role === 'student') {
      window.location = "/profile";
    } else if (this.state.role === 'teacher') {
      this.setState({teacherStage: 2});
    }
  },

  render: function () {
    var view;
    if (this.state.stage === 1) {
      view = <EC.NewAccountStage1 selectRole={this.selectRole} />;
    } else if (this.state.stage === 2) {
      if (this.state.role === 'student') {
        view = <EC.NewStudent update={this.update} signUp={this.signUp} errors={this.state.errors}/>;
      } else {
        view = <EC.NewTeacher sendNewsletter={this.state.sendNewsletter} stage={this.state.teacherStage} update={this.update} signUp={this.signUp} errors={this.state.errors} />;
      }
    }
    return view;
  }
})