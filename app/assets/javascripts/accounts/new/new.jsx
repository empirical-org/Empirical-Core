'use strict';
$(function () {
  var ele = $('#sign-up');
  if (ele.length) {
    React.render(React.createElement(EC.NewAccount), ele[0]);
  }
});

EC.NewAccount = React.createClass({
  propTypes: {

  },

  getInitialState: function () {
    return {
      stage: 1,
      role: null
    };
  },



  selectRole: function (role) {
    console.log('select role', role);
    this.setState({role: role});
    this.setState({stage: 2});
  },

  render: function () {
    if (this.state.stage === 1) {
      return (
        <span>
          <EC.RoleOption selectRole={this.selectRole} role='student' />
          <EC.RoleOption selectRole={this.selectRole} role='teacher' />
        </span>
      );
    } else if (this.state.stage === 2) {
      return (
        <span>
          <EC.GoogleSignIn />
        </span>
      );
    }
  }
})