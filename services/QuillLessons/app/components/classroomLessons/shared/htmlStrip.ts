export default function(html:string) {
  return html.replace(/(<strong[^>]+?>|<strong>|<\/strong>)/img, "").replace(/(<em[^>]+?>|<em>|<\/em>)/img, "").replace(/(<ins[^>]+?>|<ins>|<\/ins>)/img, "");
}
