import * as React from 'react';
import { mount } from 'enzyme';

import { EvidenceWidget }from '../../components/evidenceWidget';

describe('EvidenceWidget Component', () => {
  const component = mount(<EvidenceWidget />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
