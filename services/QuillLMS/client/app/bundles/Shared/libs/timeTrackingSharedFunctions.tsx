import * as _ from 'lodash'

export const roundValuesToSeconds = (timeTrackingHash) => {
  const newHash = {}
  Object.keys(timeTrackingHash).forEach(key => {
    newHash[key] = roundMillisecondsToSeconds(timeTrackingHash[key])
  })
  return newHash
}

export const roundMillisecondsToSeconds = (milliseconds) => _.round(milliseconds / 1000)
