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
  propTypes: {
    analytics: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    this.modules = {
      textInputGenerator: new EC.modules.TextInputGenerator(this, this.updateKeyValue)
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

  updateKeyValue: function (key, value) {
    var state = this.state;
    state[key] = value;
    this.setState(state);
  },

  update: function (hash) {
    var state = this.state;
    state = _.merge(state, hash)
    this.setState(state);
  },

  signUp: function () {
    this.props.analytics.track('signed up');
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
    name = _.reduce([this.state.first_name, this.state.last_name], function (memo, current) {
      var nextMemo;
      if (!this.existy(memo)) {
        nextMemo = current;
      } else if (!this.existy(current)) {
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
      view = <EC.NewAccountStage1 selectRole={this.selectRole} />;
    } else if (this.state.stage === 2) {
      if (this.state.role === 'student') {
        view = <EC.NewStudent textInputGenerator={this.modules.textInputGenerator}
                              update={this.update}
                              signUp={this.signUp}
                              errors={this.state.errors}/>;
      } else {
        view = <EC.NewTeacher textInputGenerator={this.modules.textInputGenerator}
                              sendNewsletter={this.state.sendNewsletter}
                              stage={this.state.teacherStage}
                              update={this.update}
                              signUp={this.signUp}
                              errors={this.state.errors}
                              analytics={this.props.analytics}/>;
      }
    }
    return view;
  }
});
