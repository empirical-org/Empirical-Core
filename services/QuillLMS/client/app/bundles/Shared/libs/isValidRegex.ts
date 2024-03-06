export function isValidRegex(str) {
  try {
    const regex = new RegExp(str)
    return !!regex
  } catch (err) {
    return false
  }
}

export function isValidAndNotEmptyRegex(string) {
  return string.length && isValidRegex(string)
}
