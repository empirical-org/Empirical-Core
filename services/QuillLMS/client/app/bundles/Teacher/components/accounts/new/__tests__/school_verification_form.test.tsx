import * as React from 'react';
import { mount } from 'enzyme';

import SchoolVerificationForm from '../school_verification_form';

describe('SchoolVerificationForm component', () => {

  it('should render', () => {
    const component = mount(<SchoolVerificationForm schoolName="School Name" />);
    expect(component).toMatchSnapshot();
  });
  
});
