export default (flag: string): Array<string|undefined> => {
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
