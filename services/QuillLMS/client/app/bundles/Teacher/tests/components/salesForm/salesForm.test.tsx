import * as React from 'react';
import { mount } from 'enzyme';

import { SalesForm }from '../../../components/salesForm';

jest.mock('fuse.js', () => ({
  default: jest.fn()
}));

describe('SalesForm Component', () => {
  const component = mount(<SalesForm type="renewal request" />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
