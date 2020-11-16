import * as React from 'react';
import { shallow } from 'enzyme';

import { PageLayout } from '../PageLayout';

describe('PageLayout Component', () => {
  const component = shallow(<PageLayout />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
