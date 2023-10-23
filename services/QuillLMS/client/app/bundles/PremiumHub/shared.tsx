import * as React from 'react'
import * as _ from 'lodash'

import * as md5 from 'md5'

import { unorderedArraysAreEqual, } from '../../modules/unorderedArraysAreEqual'

export const RESTRICTED = 'restricted'
export const LIMITED = 'limited'
export const FULL = 'full'
export const LOADING = 'loading'

export const APPROVED = 'Approved'
export const PENDING = 'Pending'
export const DENIED = 'Denied'
export const SKIPPED = 'Skipped'

export const premiumLockImage = <img alt="Gray lock" src={`${process.env.CDN_URL}/images/pages/administrator/premium_lock.svg`} />

export const restrictedElement = (
  <div className="restricted">
    {premiumLockImage}
  </div>
)

export const restrictedPage = (
  <div className="restricted-page">
    {premiumLockImage}
  </div>
)

export function selectionsEqual(firstSelection, secondSelection) {
  return (
    firstSelection == secondSelection || // less strict comparison so that undefined and null are treated as equal
    unorderedArraysAreEqual(firstSelection, secondSelection)
  )
}

export function mapItemsIfNotAll(selectedItems, allItems, mapKey = 'id') {
  // selectedItems may, by design, be a superset of allItems, but if everything in allItems is in selectedItems, we want to treat it as "everything" being selected
  const allItemsSelected = allItems.every((item) => {
    return _.some(selectedItems, item)
  })

  if (allItemsSelected || selectionsEqual(selectedItems, allItems)) return null

  return selectedItems.map(i => i[mapKey])
}

/* Should produce the same output as backend `app/services/payload_hasher.rb:run` */
export function hashPayload(payloadArray: Array<any>) {
  const joinedPayload = payloadArray.join('-')
  return md5(joinedPayload)
}
