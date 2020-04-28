import * as Filter from 'bad-words'
import { sentences } from 'sbd'

const filter = new Filter()


const MINIMUM_WORD_COUNT = 3
const MAXIMUM_WORD_COUNT = 100

export const TOO_SHORT_FEEDBACK = "Whoops, it looks like you submitted your response before it was ready! Re-read what you wrote and finish the sentence provided."
export const TOO_LONG_FEEDBACK = "Revise your work so it is shorter and more concise."
export const PROFANITY_FEEDBACK = "Revise your work. When writing your response, make sure to use appropriate language."
export const MULTIPLE_SENTENCES_FEEDBACK = "Revise your work. Your response should be only one sentence long."

interface FilterResponse {
  matched: boolean,
  feedback: string,
  feedbackKey: string
}

type PreFilter = (s: string) => FilterResponse;

const filters: PreFilter[] = [
  profanity,
  tooShort,
  multipleSentences,
  tooLong,
];

export default function preFilters(str: string): FilterResponse | undefined {
  for (const f of filters) {
    const response = f(str)
    if (response.matched) {
       return response
    }
  }
  return undefined
}

// filter functions
export function profanity(str: string): FilterResponse {
  const matched = filter.isProfane(str)
  return { matched, feedback: PROFANITY_FEEDBACK, feedbackKey: 'profanity' }
}

export function tooShort(str: string): FilterResponse {
  const matched = textWithoutStemArray(str).length < MINIMUM_WORD_COUNT
  return { matched, feedback: TOO_SHORT_FEEDBACK, feedbackKey: 'too-short' }
}

export function multipleSentences(str: string): FilterResponse {
  const matched = sentences(str, {}).length > 1
  return { matched, feedback: MULTIPLE_SENTENCES_FEEDBACK, feedbackKey: 'multiple-sentences' }
}

export function tooLong(str: string): FilterResponse {
  const matched = textWithoutStemArray(str).length > MAXIMUM_WORD_COUNT
  return { matched, feedback: TOO_LONG_FEEDBACK, feedbackKey: 'too-long' }
}

function textWithoutStemArray(str: string): string[] {
  return str.split(' ').filter((s: string) => s.length)
}
