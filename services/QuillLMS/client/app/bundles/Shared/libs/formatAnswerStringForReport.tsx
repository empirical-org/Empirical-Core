import * as React from 'react'
import { diffWords, } from 'diff'

export function formatAnswerStringForReports(answer, previousAnswer, attemptNum, showDiff) {
  let answerString = answer
  if (previousAnswer && showDiff) {
    const diff = diffWords(previousAnswer, answer)
    answerString = diff.map((word) => {
      if (word.removed) { return '' }
      const key = `${attemptNum}-${word.value}`;
      return word.added ? <b key={key}>{word.value}</b> : <span key={key}>{word.value}</span>
    })
  }
  return answerString
}
