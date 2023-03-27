import { mount } from 'enzyme';
import * as React from 'react';

import { subjectAreas } from '../../accounts/shared/__tests__/data';
import TeacherInfoModal from '../teacher_info_modal';

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
