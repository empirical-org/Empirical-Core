import { determineShortestCue, generateSpan, generateOffsetWidth, } from './fillInBlankInputStyleHelpers'

const PADDING_WIDTH = 20

export function fillInBlankInputStyle(value: string|null, cues: Array<string>) {
  const spanForShortestCue = generateSpan(determineShortestCue(cues))
  const spanForValue = generateSpan(value)

  const shortestCueSpanWidth = generateOffsetWidth(spanForShortestCue);
  const valueSpanWidth = generateOffsetWidth(spanForValue);

  const elementWidth = Math.max(shortestCueSpanWidth, valueSpanWidth) + PADDING_WIDTH

  document.body.removeChild(spanForShortestCue);
  document.body.removeChild(spanForValue);

  const valueShorterThanShortestCue = shortestCueSpanWidth > valueSpanWidth

  return { width: `${elementWidth}px`, textAlign: valueShorterThanShortestCue ? 'center' : 'left', paddingRight: valueShorterThanShortestCue ? '10px' : '0px' };
}
