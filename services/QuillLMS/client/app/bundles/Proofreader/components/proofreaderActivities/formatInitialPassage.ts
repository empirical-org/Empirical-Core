import * as _ from 'lodash';

const formatInitialPassage = (passage: string) => {
  passage = passage.replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
  const necessaryEdits = passage.match(/{\+[^-]+-[^|]+\|[^}]*}/g)
  const necessaryEditRegex = /\+[^-]+-[^|]+\|[^}]*/
  const correctEditRegex = /\+([^-]+)-/m
  const originalTextRegex = /\-([^|]+)\|/m
  const conceptUIDRegex = /\|([^}]+)/m
  const paragraphs = passage.replace('</p><p>', '<br/>').replace(/<p>|<\/p>/g, '').split('<br/>')
  let necessaryEditCounter = 0
  let paragraphIndex = 0
  const passageArray = paragraphs.map((paragraph: string) => {
    if (paragraph.length === 0) {
      return null
    }
    let i = 0
    const paragraphArray = paragraph.split(/{|}/).map((text) => {
      let wordObj, wordArray
      if (necessaryEditRegex.test(text)) {
        wordObj = {
          originalText: text.match(originalTextRegex) ? text.match(originalTextRegex)[1] : '',
          currentText: text.match(originalTextRegex) ? text.match(originalTextRegex)[1] : '',
          necessaryEditIndex: necessaryEditCounter,
          conceptUID: text.match(conceptUIDRegex) ? text.match(conceptUIDRegex)[1] : '',
          correctText: text.match(correctEditRegex) ? text.match(correctEditRegex)[1] : '',
          underlined: true,
          wordIndex: i,
          paragraphIndex
        }
        wordArray = [wordObj]
        necessaryEditCounter+=1
        i+=1
      } else {
        wordArray = text.split(/\s+/).map(word => {
          if (word.length === 0) {
            return null
          }
          wordObj = {
            originalText: word,
            currentText: word,
            correctText: word,
            underlined: false,
            wordIndex: i,
            paragraphIndex
          }
          i+=1
          return wordObj
        })
      }
      return wordArray.filter(Boolean)
    })
    paragraphIndex+=1
    return _.flatten(paragraphArray)
  })
  return {passage: passageArray.filter(Boolean), necessaryEdits}
}

export default formatInitialPassage
