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

export const OVERVIEW = 'overview'
export const SKILL = 'skill'
export const STUDENT = 'student'

export const DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH = '182px'
export const groupByDropdownOptions = [{ label: 'Grade', value: 'grade' }, { label: 'Teacher', value: 'teacher' }, { label: 'Classroom', value: 'classroom' }]
export const diagnosticTypeDropdownOptions = [
  { label: 'Starter Baseline Diagnostic (Pre)', value: 'Starter Baseline Diagnostic (Pre)' },
  { label: 'Starter Growth Diagnostic (Post)', value: 'Starter Growth Diagnostic (Post)' },
  { label: 'Intermediate Baseline Diagnostic (Pre)', value: 'Intermediate Baseline Diagnostic (Pre)' },
  { label: 'Intermediate Growth Diagnostic (Post)', value: 'Intermediate Growth Diagnostic (Post)' },
  { label: 'Advanced Baseline Diagnostic (Pre)', value: 'Advanced Baseline Diagnostic (Pre)' },
  { label: 'Advanced Growth Diagnostic (Post)', value: 'Advanced Growth Diagnostic (Post)' },
  { label: 'ELL Starter Baseline Diagnostic (Pre)', value: 'ELL Starter Baseline Diagnostic (Pre)' },
  { label: 'ELL Starter Growth Diagnostic (Post)', value: 'ELL Starter Growth Diagnostic (Post)' },
  { label: 'ELL Intermediate Baseline Diagnostic (Pre)', value: 'ELL Intermediate Baseline Diagnostic (Pre)' },
  { label: 'ELL Intermediate Growth Diagnostic (Post)', value: 'ELL Intermediate Growth Diagnostic (Post)' },
  { label: 'ELL Advanced Baseline Diagnostic (Pre)', value: 'ELL Advanced Baseline Diagnostic (Pre)' },
  { label: 'ELL Advanced Growth Diagnostic (Post)', value: 'ELL Advanced Growth Diagnostic (Post)' },
  { label: 'AP Writing Skills Survey', value: 'AP Writing Skills Survey' },
  { label: 'Pre-AP Writing Skills Survey 1', value: 'Pre-AP Writing Skills Survey 1' },
  { label: 'Pre-AP Writing Skills Survey 2', value: 'Pre-AP Writing Skills Survey 2' },
  { label: 'SpringBoard Writing Skills Survey', value: 'SpringBoard Writing Skills Survey' }
]

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
