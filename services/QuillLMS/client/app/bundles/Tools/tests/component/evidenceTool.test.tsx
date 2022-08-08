import * as React from 'react';
import { mount } from 'enzyme';

import { EvidenceTool }from '../../components/evidenceTool';

describe('EvidenceTool Component', () => {
  const component = mount(<EvidenceTool loggedInUser={true} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
