export function fillInBlankInputWidth(value: string|null, cues: Array<string>) {
  const span = document.createElement('span');

  span.style.fontSize = '24px'; // matches the font size for the fill in the blank inputs and must be adjusted if they change
  span.style.visibility = 'hidden';
  document.body.appendChild(span);

  span.textContent = determineBaseString(value, cues)

  const calculatedWidth = span.offsetWidth + 20; // 20 is for padding

  document.body.removeChild(span);

  return { width: `${calculatedWidth}px` };
}

export function determineBaseString(value: string|null, cues: Array<string>): string {
  // we want the input to start at the width of the shortest cue* and then expand to fit whatever the value is
  // * unless the shortest cue is just one or two characters, which we handle with a CSS minWidth
  const shortestCue = cues?.length > 0 ? cues.reduce((a, b) => a.length < b.length ? a : b) : "";
  return (value && value.length > shortestCue.length) ? value : shortestCue;
}
