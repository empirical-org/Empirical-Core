export const flagArray = (flag) => {
  let flagArray = ['production']
  if (flag === 'alpha') {
    flagArray = ['alpha', 'beta', 'production']
  } else if (flag === 'beta') {
    flagArray = ['beta', 'production']
  } else if (flag === 'archived') {
    flagArray = ['archived', 'alpha', 'beta', 'production']
  }
  return flagArray
}

export const permittedFlag = (activityFlag, questionFlag) => {
  const notNullActivityFlag = activityFlag || 'production'
  const notNullQuestionFlag = questionFlag || 'production'
  return flagArray(notNullActivityFlag).includes(notNullQuestionFlag)
}
