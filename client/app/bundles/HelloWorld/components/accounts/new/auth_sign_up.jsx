'use strict';
import React from 'react'
import GoogleSignUp from './google_sign_up'
import CleverSignUp from './clever_sign_up'

export default React.createClass({
  render: function () {
    return (
      <div className='text-center'>
            <GoogleSignUp/>
            <CleverSignUp/>
      </div>
    );
  }
});
