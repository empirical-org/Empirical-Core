export function scriptTagStrip(html: string) {
  const stripped = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
  return stripped;
}
