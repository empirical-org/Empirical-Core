export const highlightSpellingGrammar = (str: string, wordsToFormat: string | string[]) => {
  let wordArray = [].concat(wordsToFormat)
  let newString = str
  wordArray.forEach((word) => {
    const matched = newString.match(`${word}[\\w\']*`)
    if (matched) {
      const augmentedRegex = new RegExp(`${matched[0]}`, 'g')
      newString = newString.replace(augmentedRegex, `<b>${matched[0]}</b>`)
    }
  })
  return newString
}
