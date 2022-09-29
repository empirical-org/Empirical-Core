export const fillInBlankInputLabel = (cues, blankAllowed=false) => {
  const blankAllowedText = blankAllowed ? ' or leave it empty' : ''
  if (!cues || !cues.length) {
    return `Add words to fill the blank${blankAllowedText}.`
  }

  return `Choose which one of the following options fits best in the blank ${blankAllowedText}: ${cues.join(', ')}.`
}
