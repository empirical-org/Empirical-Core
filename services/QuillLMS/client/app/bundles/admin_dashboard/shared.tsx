import * as React from 'react'

export const RESTRICTED = 'restricted'
export const LIMITED = 'limited'
export const FULL = 'full'

export const premiumLockImage = <img alt="Gray lock" src={`${process.env.CDN_URL}/images/pages/administrator/premium_lock.svg`} />

export const restrictedElement = (
  <div className="restricted">
    {premiumLockImage}
  </div>
)
