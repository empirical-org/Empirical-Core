import { determineShortestCue, generateSpan, generateOffsetWidth, } from './fillInBlankInputStyleHelpers'

// these two are coming from the style files (see .fill-in-blank-input) and will need to get updated if the styling does
const PADDING_WIDTH = 20
const ELEMENT_MIN_WIDTH = 55

export function fillInBlankInputStyle(value: string|null, cues: Array<string>) {
  const spanForShortestCue = generateSpan(determineShortestCue(cues))
  const spanForValue = generateSpan(value)

  const shortestCueSpanWidth = generateOffsetWidth(spanForShortestCue);
  const valueSpanWidth = generateOffsetWidth(spanForValue);

  const elementWidth = Math.max(shortestCueSpanWidth, valueSpanWidth) + PADDING_WIDTH

  document.body.removeChild(spanForShortestCue);
  document.body.removeChild(spanForValue);

  const elementShorterThanMinWidth = ELEMENT_MIN_WIDTH >= elementWidth
  const valueShorterThanShortestCue = shortestCueSpanWidth > valueSpanWidth
  const shouldCenterInput = elementShorterThanMinWidth || valueShorterThanShortestCue

  return { width: `${elementWidth}px`, textAlign: shouldCenterInput ? 'center' : 'left', paddingRight: shouldCenterInput ? '10px' : '0px' };
}
