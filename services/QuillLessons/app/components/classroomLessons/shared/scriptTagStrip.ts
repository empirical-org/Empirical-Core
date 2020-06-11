interface answerHash {
  [key:string]: string
}

function replaceScriptTags(html: string) {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
}

export function scriptTagStrip(answer: string|answerHash) {
  let stripped
  if (typeof answer === 'string') {
    stripped = replaceScriptTags(answer)
  } else {
    stripped = {}
    Object.keys(answer).forEach(key => stripped[key] = replaceScriptTags(answer[key]))
  }
  return stripped;
}
