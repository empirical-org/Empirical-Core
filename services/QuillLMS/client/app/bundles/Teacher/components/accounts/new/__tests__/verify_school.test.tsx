import * as React from 'react';
import { mount } from 'enzyme';

import VerifySchool from '../verify_school';

describe('VerifySchool component', () => {

  it('should render if there are no admins', () => {
    const component = mount(<VerifySchool passedAdmins={[]} passedSchoolName="School Name" />);
    expect(component).toMatchSnapshot();
  });

  it('should render if there are admins', () => {
    const component = mount(<VerifySchool passedAdmins={[{ name: 'Joy Harjo', email: 'joyharjo@quill.org', id: 1 }]} passedSchoolName="School Name" />);
    expect(component).toMatchSnapshot();
  });

});
