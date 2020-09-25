import React from 'react';

import { SegmentAnalytics, Events } from '../../../../../modules/analytics';

const handleClickSignUpWithGoogle = (e) => SegmentAnalytics.track(Events.SUBMIT_SIGN_UP, {provider: Events.providers.GOOGLE})

const GoogleSignUp = () => (
  <a
    className="google-sign-up"
    href="/auth/google_oauth2?prompt=consent"
    onClick={handleClickSignUpWithGoogle}
  >
    <img alt="Google icon" src={`${process.env.CDN_URL}/images/shared/google_icon.svg`}  />
    <span>Sign up with Google</span>
  </a>
);

export default GoogleSignUp
