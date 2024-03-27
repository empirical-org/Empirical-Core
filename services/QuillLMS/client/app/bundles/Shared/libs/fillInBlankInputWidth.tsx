export function fillInBlankInputWidth(value: string|null, cues: Array<string>) {
  const shortestCue = cues && cues.length ? cues.sort((a: { length: number}, b: { length: number}) => b.length - a.length)[cues.length - 1] : null
  const shortestCueLength = shortestCue?.length || 3  // 3 was just chosen for aesthetics
  const width = value && value.length > shortestCueLength ? (value.length * 15) + 10 : (shortestCueLength * 15) + 10
  return{ width: `${width}px` }
}
