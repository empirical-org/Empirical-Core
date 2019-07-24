import React from 'react'
import { SegmentAnalytics, Events } from '../../../../../modules/analytics'; 

export default () => (
  <div className="agreements-and-link-to-login">
    <p className="return-to-login">Already have an account?
      <a href="/session/new" onClick={(e) => SegmentAnalytics.track(Events.CLICK_LOG_IN, {location: 'alreadyHaveAccount'})}>Log in</a>
    </p>
    <p className="agreements">By signing up, you agree to our <a href="/tos">Terms of Service</a> and <a href="/privacy">Privacy&nbsp;Policy.</a></p>
  </div>
)
