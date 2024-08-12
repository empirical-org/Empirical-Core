export function generateSpan(text) {
  const span = document.createElement('span');

  span.style.fontSize = '24px'; // matches the font size for the fill in the blank inputs and must be adjusted if they change

  span.style.marginLeft = '1px' // this fixes a bug caused by the browser somehow misinterpreting which letters belong to which element
  span.style.visibility = 'hidden'
  span.textContent = text

  document.body.appendChild(span);

  return span
}

export function determineShortestCue(cues: Array<string>): string {
  return cues?.length > 0 ? cues.reduce((a, b) => a.length < b.length ? a : b) : ""
}

export function generateOffsetWidth(element: HTMLElement): number {
  return element.offsetWidth
}
