import React from 'react';
import { SegmentAnalytics, Events } from '../../../../../modules/analytics'; 

export default () => (
  <a
    className="google-sign-up"
    href="/auth/google_oauth2?prompt=consent"
    onClick={(e) => SegmentAnalytics.track(Events.SUBMIT_SIGN_UP, {provider: Events.providers.GOOGLE})}
  >
    <img alt="google icon" src="/images/google_icon.svg"  />
    <span>Sign up with Google</span>
  </a>
);
