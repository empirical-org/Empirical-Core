import * as React from 'react';

const beginBold = '<span class="sr-only">(begin bold) </span>'
const endBold = '<span class="sr-only"> (end bold)</span>'

const SentenceFragments = ({ prompt, }) => {
  const promptAnnotatedForScreenreader = prompt.replace(/<strong>/g, `${beginBold}<strong>`).replace(/<\/strong>/g, `</strong>${endBold}`)
  return <div className="draft-js sentence-fragments" dangerouslySetInnerHTML={{ __html: promptAnnotatedForScreenreader, }} />
}

export { SentenceFragments };

