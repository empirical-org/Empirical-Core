const PRODUCTION = 'production'
const ALPHA = 'alpha'
const BETA = 'beta'
const GAMMA = 'gamma'
const ARCHIVED = 'archived'

export const flagArray = (flag) => {
  let flagArray = [PRODUCTION]
  if (flag === ALPHA) {
    flagArray = [ALPHA, BETA, GAMMA, PRODUCTION]
  } else if (flag === BETA) {
    flagArray = [BETA, GAMMA, PRODUCTION]
  } else if (flag === GAMMA) {
    flagArray = [GAMMA, PRODUCTION]
  } else if (flag === ARCHIVED) {
    flagArray = [ARCHIVED, ALPHA, BETA, GAMMA, PRODUCTION]
  }
  return flagArray
}

export const permittedFlag = (activityFlag, questionFlag) => {
  const notNullActivityFlag = activityFlag || PRODUCTION
  const notNullQuestionFlag = questionFlag || PRODUCTION
  return flagArray(notNullActivityFlag).includes(notNullQuestionFlag)
}
