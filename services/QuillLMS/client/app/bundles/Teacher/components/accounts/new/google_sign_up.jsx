import React from 'react';
import { SegmentAnalytics, Events } from '../../../../../modules/analytics';

const GoogleSignUp = () => (
  <a
    className="google-sign-up"
    href="/auth/google_oauth2?prompt=consent"
  >
    <img alt="Google icon" src={`${process.env.CDN_URL}/images/shared/google_icon.svg`}  />
    <span>Sign up with Google</span>
  </a>
);

export default GoogleSignUp
