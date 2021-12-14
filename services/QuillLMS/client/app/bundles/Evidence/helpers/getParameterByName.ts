export default function getParameterByName(name: string, url: string, ifMissing: any = '') {
  if (!url) { url = window.location.href; }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) { return ifMissing; }
  if (!results[2]) { return ifMissing; }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
