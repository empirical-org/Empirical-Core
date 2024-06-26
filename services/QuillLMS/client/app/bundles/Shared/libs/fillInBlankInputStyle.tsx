const PADDING_WIDTH = 20

export function fillInBlankInputStyle(value: string|null, cues: Array<string>, isTest: Boolean = false) {
  const spanForShortestCue = generateSpan(determineShortestCue(cues))
  const spanForValue = generateSpan(value)

  const shortestCueSpanWidth = getOffsetWidth(spanForShortestCue, isTest);
  const valueSpanWidth = getOffsetWidth(spanForValue, isTest);

  const elementWidth = Math.max(shortestCueSpanWidth, valueSpanWidth) + PADDING_WIDTH

  document.body.removeChild(spanForShortestCue);
  document.body.removeChild(spanForValue);

  const valueShorterThanShortestCue = shortestCueSpanWidth > valueSpanWidth

  return { width: `${elementWidth}px`, textAlign: valueShorterThanShortestCue ? 'center' : 'left', paddingRight: valueShorterThanShortestCue ? '10px' : '0px' };
}

export function generateSpan(text) {
  const span = document.createElement('span');

  span.style.fontSize = '24px'; // matches the font size for the fill in the blank inputs and must be adjusted if they change
  span.style.visibility = 'hidden';
  span.textContent = text

  document.body.appendChild(span);

  return span
}

export function determineShortestCue(cues: Array<string>): string {
  return cues?.length > 0 ? cues.reduce((a, b) => a.length < b.length ? a : b) : ""
}

export function getOffsetWidth(element, isTest) {
  return isTest ? (element.textContent?.length || 0) * 10 : element.offsetWidth
}
