import { mount } from 'enzyme';
import * as React from 'react';

import { subjectAreas } from '../../shared/__tests__/data';
import AddTeacherInfo from '../add_teacher_info';

describe('AddTeacherInfo component', () => {
  const props = {
    subjectAreas
  };

  it('should render', () => {
    const component = mount(<AddTeacherInfo {...props} />);
    expect(component).toMatchSnapshot();
  });

});
