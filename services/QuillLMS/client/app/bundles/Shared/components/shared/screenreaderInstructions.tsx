import * as React from 'react'

// disabling the tabIndex rule because setting a tabIndex seemed like the best way to ensure this line would always be read first, and I couldn't find a more appropriate aria-role.
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
export const ScreenreaderInstructions = () => (
  <p className="screenreader-instructions" tabIndex={0}>
    Screenreader users, please use your reading keys to navigate this activity.
  </p>
)
