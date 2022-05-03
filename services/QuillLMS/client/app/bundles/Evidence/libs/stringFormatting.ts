export const highlightSpelling = (str: string, wordsToFormat: string | string[]) => {
  let wordArray = [].concat(wordsToFormat)
  let newString = str
  wordArray.forEach((word) => {
    const matched = newString.match(`${word}[\\w\']*`)
    if (matched && matched[0] &&  matched[0] !== '&nbsp') {
      const augmentedRegex = new RegExp(`${matched[0]}`, 'g')
      newString = newString.replace(augmentedRegex, `<b>${matched[0]}</b>`)
    }
  })
  return newString
}

export const highlightGrammar = (str: string, highlightArray, promptLength: number=0) => {
  if (highlightArray.length < 1) { return str }

  highlightArray.sort(descendingOffsetComparator)

  highlightArray.forEach((highlight) => {
    let offset = highlight.character - promptLength - 1
    let stringAfterOffset = str.slice(offset)
    let stringBeforeOffset = str.slice(0, offset)

    const phraseToFormat = stripEvidenceHtml(highlight.text)
    const matched = stringAfterOffset.match(`${phraseToFormat}[\\w\']*`)

    if (matched && matched[0] &&  matched[0] !== '&nbsp') {
      const augmentedRegex = new RegExp(`${matched[0]}`)
      stringAfterOffset = stringAfterOffset.replace(augmentedRegex, `<b>${matched[0]}</b>`)
    }

    str = stringBeforeOffset + stringAfterOffset;
  })

  return str
}

export const stripEvidenceHtml = (html: string) => html.replace(/<p>|<\/p>|<u>|<\/u>|<b>|<\/b>|<br>|<br\/>/g, '').replace(/&nbsp;/g, ' ')

const descendingOffsetComparator = (a, b) => {
  return (a['offset'] - b['offset']) * (-1)
}
