EC.GoogleSignUp = React.createClass({

  signUp: function () {
    console.log('sing up google');
  },

  render: function () {
    return (
      <div onClick={this.signUp} className='google-sign-up'></div>
    );
  }
});