export const flagArray = (flag: string): Array<string|undefined> => {
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

export const permittedFlag = (activityFlag: string|undefined, questionFlag: string|undefined):Boolean => {
  const notNullActivityFlag = activityFlag || 'production'
  const notNullQuestionFlag = questionFlag || 'production'
  return flagArray(notNullActivityFlag).includes(notNullQuestionFlag)
}
