import React from 'react';
import SegmentAnalytics from '../../../../../modules/analytics'; 
import Events from '../../../../../modules/analytics/events'; 

export default () => (
  <a className="google-sign-up" href="/auth/google_oauth2?prompt=consent"
     onClick={(e) => SegmentAnalytics.track(Events.SUBMIT_SIGN_UP, {provider: 'google'})}>
    <img src="/images/google_icon.svg" alt="google icon"  />
    <span>Sign up with Google</span>
  </a>
);
