import React from 'react';
import { shallow } from 'enzyme';

import TeacherResourcesMini from '../teacher_resources_mini';

describe('TeacherResourcesMini component', () => {

  it('should render', () => {
    const wrapper = shallow(
      <TeacherResourcesMini />
    );
    expect(wrapper).toMatchSnapshot();
  });

});
