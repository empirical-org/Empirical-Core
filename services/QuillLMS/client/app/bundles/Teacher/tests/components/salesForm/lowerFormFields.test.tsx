import * as React from 'react';
import { mount } from 'enzyme';

import { LowerFormFields }from '../../../components/salesForm/lowerFormFields';

jest.mock('fuse.js', () => ({
  default: jest.fn()
}));

describe('LowerFormFields Component', () => {
  const mockProps = {
    errors: {},
    handleUpdateField: jest.fn(),
    schoolPremimumEstimate: 1,
    teacherPremimumEstimate: 20,
    studentPremimumEstimate: 400,
    comments: ''
  }
  const component = mount(<LowerFormFields {...mockProps} />);

  it('should match snapshot', () => {
    expect(component).toMatchSnapshot();
  });
});
