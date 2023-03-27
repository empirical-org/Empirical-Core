import { mount } from 'enzyme';
import * as React from 'react';

import VerifySchool from '../verify_school';

describe('VerifySchool component', () => {

  it('should render', () => {
    const component = mount(<VerifySchool passedSchoolName="School Name" />);
    expect(component).toMatchSnapshot();
  });
});
