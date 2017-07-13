import React from 'react'

const GoogleSignUp = props => (
  <button className="google-sign-up" onClick={() => window.location = '/auth/google_oauth2'}>
    <img src='/images/google_icon.svg'/>
    <span>Sign up with Google</span>
  </button>
)

export default GoogleSignUp
