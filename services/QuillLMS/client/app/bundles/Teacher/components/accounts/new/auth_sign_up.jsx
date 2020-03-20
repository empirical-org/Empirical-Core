'use strict';
import React from 'react'
import GoogleSignUp from './google_sign_up'
import CleverSignUp from './clever_sign_up'

export default class extends React.Component {
  render() {
    return (
      <div className='text-center auth-section'>
        <GoogleSignUp />
        <CleverSignUp />
      </div>
    );
  }
}
