import { mount } from 'enzyme';
import * as React from 'react';

import { UpperFormFields } from '../../../components/salesForm/upperFormFields';

jest.mock('fuse.js', () => ({
  default: jest.fn()
}));

describe('UpperFormFields Component', () => {
  const mockProps = {
    errors: {},
    handleUpdateField: jest.fn(),
    type: 'renewal request',
    firstName: 'Bianca',
    lastName: 'Del Rio',
    email: 'test@gmail.com',
    phoneNumber: '8675309',
    zipcode: '10009'
  }
  const component = mount(<UpperFormFields {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
