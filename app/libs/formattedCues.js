export function formattedCues (cues) {
  const upcasedCues = cues.map((cue)=>{
    return cue.charAt(0).toUpperCase() + cue.substring(1);
  })
  return `(${upcasedCues.join(', ')})`
}
