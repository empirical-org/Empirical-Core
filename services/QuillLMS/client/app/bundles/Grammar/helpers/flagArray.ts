const PRODUCTION = 'production'
const ALPHA = 'alpha'
const BETA = 'beta'
const GAMMA = 'gamma'
const ARCHIVED = 'archived'

export const flagArray = (flag: string): Array<string|undefined> => {
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

export const permittedFlag = (activityFlag: string|undefined, questionFlag: string|undefined):Boolean => {
  const notNullActivityFlag = activityFlag || PRODUCTION
  const notNullQuestionFlag = questionFlag || PRODUCTION
  return flagArray(notNullActivityFlag).includes(notNullQuestionFlag)
}
