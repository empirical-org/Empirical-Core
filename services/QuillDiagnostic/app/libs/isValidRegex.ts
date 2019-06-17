export const isValidRegex = (str: string) => {
  try {
    new RegExp(str)
    return true
  } catch (err) {
    return false
  }
}
