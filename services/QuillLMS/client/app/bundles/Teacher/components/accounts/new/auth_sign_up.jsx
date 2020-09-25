'use strict';
import React from 'react'

import GoogleSignUp from './google_sign_up'
import CleverSignUp from './clever_sign_up'

const AuthSignUp = () => {
  return (
    <div className='text-center auth-section'>
      <GoogleSignUp />
      <CleverSignUp />
    </div>
  );
};

export default AuthSignUp;
