import * as React from 'react';
import { mount } from 'enzyme';

import { EvidenceHomeSection }from '../../components/evidenceHomeSection';

describe('EvidenceHomeSection Component', () => {
  const component = mount(<EvidenceHomeSection />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
