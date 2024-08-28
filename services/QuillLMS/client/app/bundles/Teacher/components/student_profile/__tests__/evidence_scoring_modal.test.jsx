import * as React from 'react';
import { render } from "@testing-library/react";

import EvidenceScoringModal from '../evidence_scoring_modal';

describe('EvidenceScoringModal component', () => {

  it('should render', () => {
    const { asFragment, } = render(
      <EvidenceScoringModal
        launchLink=''
      />
    );
    expect(asFragment()).toMatchSnapshot()
  });
});
