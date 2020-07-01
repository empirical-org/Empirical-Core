export function textEditorInputNotEmpty(textInput) {
  return textInput && textInput !== '<br/>' && (textInput.replace(/[\n\r]/g, '') !== "<p><br>&nbsp;</p>") && (textInput.replace(/[\n\r]/g, '') !== "<p><br></p>");
}

export function textEditorInputClean(prompt) {
  if (prompt) {
    return prompt.replace("&nbsp;", "<br>").replace(/\\n|<br>\s+/g, "<br>").replace(/<\/p>\s*<p>/g, "<br>").replace("\n", "<br>");
  } else {
    return prompt
  }
}
