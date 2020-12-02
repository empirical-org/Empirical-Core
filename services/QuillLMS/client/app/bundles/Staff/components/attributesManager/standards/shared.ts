export const STANDARD = 'Standard'
export const STANDARD_CATEGORY = 'Standard Category'
export const STANDARD_LEVEL = 'Standard Level'

export const sortWordsThatIncludeNumbers = (attribute='name') => {
  return (a, b) => {
    const numberRegex = /(\d+)/g
    const aNumberMatch = a[attribute] && a[attribute].match(numberRegex)
    const bNumberMatch = b[attribute] && b[attribute].match(numberRegex)
    if (aNumberMatch && bNumberMatch) {
      return (Number(aNumberMatch[0]) - Number((bNumberMatch[0])))
    }

    if (aNumberMatch || !b[attribute]) { return 1 }
    if (bNumberMatch || !a[attribute]) { return -1 }

    return (a[attribute].localeCompare(b[attribute]))
  }
}
