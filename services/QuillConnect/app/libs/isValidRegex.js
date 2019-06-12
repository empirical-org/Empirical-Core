export const isValidRegex = (str) => {
  try {
    new RegExp(str)
    return true
  } catch (err) {
    return false
  }
}
