import React from 'react';

const SentenceFragments = (props: any) => <div className="draft-js sentence-fragments prevent-selection" dangerouslySetInnerHTML={{ __html: props.prompt, }} />

export { SentenceFragments }
