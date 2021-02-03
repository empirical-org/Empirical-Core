import * as React from 'react';

const SentenceFragments = (props: any) => <div className="draft-js sentence-fragments" dangerouslySetInnerHTML={{ __html: props.prompt, }} />

export { SentenceFragments }
