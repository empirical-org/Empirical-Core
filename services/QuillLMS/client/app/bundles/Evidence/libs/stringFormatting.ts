export const highlightSpelling = (str: string, wordsToFormat: string | string[]) => {
  console.log("highlighSpelling: ", str)
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

export const highlightGrammar = (oldStr: string, highlightArray=[]) => {
  let str = oldStr

  if (highlightArray.length < 1) { return str }

  highlightArray.sort(descendingOffsetComparator)

  highlightArray.forEach((highlight) => {
    let offset = highlight.offset
    let stringAfterOffset = str.slice(offset)
    let stringBeforeOffset = offset === 0 ? '' : str.slice(0, offset)

    const phraseToFormat = stripEvidenceHtml(highlight.text)
    const matched = stringAfterOffset.match(`${phraseToFormat}[\\w\']*`)

    if (matched && matched[0] &&  matched[0] !== '&nbsp') {
      const augmentedRegex = new RegExp(`${matched[0]}`)
      stringAfterOffset = stringAfterOffset.replace(augmentedRegex, `<b>${matched[0]}</b>`)
    }

    str = stringBeforeOffset + stringAfterOffset;
    console.log(" interim: ", str, "before:", stringBeforeOffset, "after:", stringAfterOffset)
  })


  return str
}

export const stripEvidenceHtml = (html: string) => html.replace(/<p>|<\/p>|<u>|<\/u>|<b>|<\/b>|<br>|<br\/>/g, '').replace(/&nbsp;/g, ' ')

const descendingOffsetComparator = (a, b) => {
  return (a['offset'] - b['offset']) * (-1)
}

