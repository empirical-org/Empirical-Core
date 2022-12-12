import * as React from 'react';
import { mount } from 'enzyme';

import AddTeacherInfo from '../add_teacher_info';
import { subjectAreas, } from '../../shared/__tests__/data'

describe('AddTeacherInfo component', () => {
  const props = {
    subjectAreas
  };

  it('should render', () => {
    const component = mount(<AddTeacherInfo {...props} />);
    expect(component).toMatchSnapshot();
  });

});
