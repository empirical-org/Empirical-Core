// http://stackoverflow.com/questions/31640234/using-google-sign-in-button-with-react-2
EC.GoogleSignIn = React.createClass({

  signOut: function () {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  },

  onSignIn: function () {
    console.log('on signin called');
  },

  renderGoogleLoginButton: function() {
    console.log('rendering google signin button')
    gapi.signin2.render('my-signin2', {
      'scope': 'https://www.googleapis.com/auth/plus.login',
      'width': 200,
      'height': 50,
      'longtitle': true,
      'theme': 'light',
      'onsuccess': this.onSignIn
    })
  },

  componentDidMount: function () {
    window.addEventListener('google-loaded', this.renderGoogleLoginButton);
  },

  render: function () {

    function onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
    }

    return (
      <span>
        <script src="https://apis.google.com/js/platform.json?onload=triggerGoogleLoaded" async='async' defer='defer'></script>
        <meta name="google-signin-client_id" content="81778652204-bd3m1t64117arrutdbv105pr5mb2kjdj.apps.googleusercontent.com"></meta>

        <script>
          function triggerGoogleLoaded() {
            window.dispatchEvent(new Event('google-loaded'))
          }
        </script>

        <div id='my-signin2'></div>
        <a href='#' onClick={this.signOut}>Sign Out</a>
      </span>
    );
  }
})