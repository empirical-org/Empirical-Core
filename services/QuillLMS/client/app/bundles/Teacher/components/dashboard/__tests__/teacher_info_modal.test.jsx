import * as React from 'react';
import { mount } from 'enzyme';

import TeacherInfoModal from '../teacher_info_modal';
import { subjectAreas, } from '../../accounts/shared/__tests__/data'

describe('TeacherInfoModal component', () => {
  const props = {
    subjectAreas,
    close: jest.fn()
  };

  it('should render', () => {
    const component = mount(<TeacherInfoModal {...props} />);
    expect(component).toMatchSnapshot();
  });

});
