export function splitPromptForFillInBlank(prompt: string) {
  return prompt.replace(/<\/p><p>/g, '</br>').replace(/^<p>/g, '').replace(/<p>/g, '<br/>').replace(/<\/p>/g, '').split('___');
}
