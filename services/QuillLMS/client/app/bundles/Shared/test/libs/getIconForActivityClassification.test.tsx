import * as expect from 'expect';
import * as React from 'react';

import { connectToolIcon, diagnosticToolIcon, evidenceToolIcon, getIconForActivityClassification, grammarToolIcon, lessonsToolIcon, proofreaderToolIcon } from '../../../Shared';

describe('#getIconForActivityClassification', () => {
  it('returns the expected icons', () => {
    expect(getIconForActivityClassification(5)).toEqual(<img alt={connectToolIcon.alt} src={connectToolIcon.src} />)
    expect(getIconForActivityClassification(4)).toEqual(<img alt={diagnosticToolIcon.alt} src={diagnosticToolIcon.src} />)
    expect(getIconForActivityClassification(2)).toEqual(<img alt={grammarToolIcon.alt} src={grammarToolIcon.src} />)
    expect(getIconForActivityClassification(6)).toEqual(<img alt={lessonsToolIcon.alt} src={lessonsToolIcon.src} />)
    expect(getIconForActivityClassification(1)).toEqual(<img alt={proofreaderToolIcon.alt} src={proofreaderToolIcon.src} />)
    expect(getIconForActivityClassification(9)).toEqual(<img alt={evidenceToolIcon.alt} src={evidenceToolIcon.src} />)
  });
});
