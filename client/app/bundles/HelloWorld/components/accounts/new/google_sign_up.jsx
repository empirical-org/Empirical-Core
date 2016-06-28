import React from 'react'

export default React.createClass({
  render: function () {
    return (
      <a href='/auth/google_oauth2'>
        <img className='google-sign-up' src='/images/sign_up_with_google.png'/>
      </a>
    );
  }
});
