export function removePunctuation(string:string) {
  return string.replace(/[^A-Za-z0-9\s]/g, '');
}