export const fillInBlankInputLabel = (cues, blankAllowed=false) => {
  const blankAllowedText = blankAllowed ? ' or leave it blank' : ''
  if (!cues || !cues.length) {
    return `Add words to complete the sentence${blankAllowedText}`
  }

  return `Complete the sentence with one of the following options${blankAllowedText}: ${cues.join(', ')}`
}
