'use strict';
import React from 'react'
import AuthGoogleAccessForm from '../AuthGoogleAccessForm';
import CleverSignUp from './clever_sign_up'

const AuthSignUp = () => {
  return (
    <div className='text-center auth-section'>
      <AuthGoogleAccessForm formClass="google-sign-up" text="Sign up with Google" />
      <CleverSignUp />
    </div>
  );
}

export default AuthSignUp;
