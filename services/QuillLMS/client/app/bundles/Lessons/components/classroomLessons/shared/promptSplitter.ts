export default function(prompt:string) {
  let htmlWrappedString = prompt.replace(/(<p[^>]+?>|<p>|<\/p>)/img, "")
  const strongRegex = /<strong>(.*?)<\/strong>/g
  const strongMatches = htmlWrappedString.match(strongRegex)
  if (strongMatches) {
    strongMatches.forEach(sm => {
      const newString = sm.replace(/(<strong[^>]+?>|<strong>|<\/strong>)/img, "").split(' ').map(s => `<strong>${s}</strong>`).join(' ')
      htmlWrappedString = htmlWrappedString.replace(sm, newString)
    })
  }

  const emRegex = /<em>(.*?)<\/em>/g
  const emMatches = htmlWrappedString.match(emRegex)
  if (emMatches) {
    emMatches.forEach(sm => {
      const newString = sm.replace(/(<em[^>]+?>|<em>|<\/em>)/img, "").split(' ').map(s => `<em>${s}</em>`).join(' ')
      htmlWrappedString = htmlWrappedString.replace(sm, newString)
    })
  }

  const insRegex = /<ins>(.*?)<\/ins>/g
  const insMatches = htmlWrappedString.match(insRegex)
  if (insMatches) {
    insMatches.forEach(sm => {
      const newString = sm.replace(/(<ins[^>]+?>|<ins>|<\/ins>)/img, "").split(' ').map(s => `<ins>${s}</ins>`).join(' ')
      htmlWrappedString = htmlWrappedString.replace(sm, newString)
    })
  }

  return htmlWrappedString.split('___')
}
