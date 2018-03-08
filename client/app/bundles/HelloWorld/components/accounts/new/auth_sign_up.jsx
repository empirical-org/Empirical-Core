'use strict';
import React from 'react'
import createReactClass from 'create-react-class'
import GoogleSignUp from './google_sign_up'
import CleverSignUp from './clever_sign_up'

export default createReactClass({
  render: function () {
    return (
      <div className='text-center auth-section'>
            <GoogleSignUp/>
            <CleverSignUp/>
      </div>
    );
  }
});
