export const formatString = (str: string) => {
  return stringifiedString(str).replace(/&#x27;/g, "'").replace(/&nbsp;/g, '').replace(/(<([^>]+)>)/ig, '').replace(/&quot;/g, '"')
}

export const formatStringAndAddSpacesAfterPeriods = (str: string) => {
  // some concept results don't have a concept result prompt so we early return to prevent the page from crashing
  if (!str) { return }
  return formatString(str).replace(/\.(?=[^ ])/g, '. ')
}

export const stringifiedString = (str: string) => {
  // handles question types in Quill Lessons where we save responses as a key-value store
  if (typeof str === 'object') {
    return Object.values(str).join("\n")
  }
  return str
}
