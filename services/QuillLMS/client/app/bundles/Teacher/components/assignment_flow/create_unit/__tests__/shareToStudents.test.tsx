import { shallow } from 'enzyme';
import * as React from 'react';

import ShareToStudents from '../share_activity_pack/shareToStudents';

describe('ShareToStudents component', () => {
  localStorage.setItem('assignedClassrooms', '[{ "classroom": "{}" }]');
  const mockProps = {
    activityPackData: {},
    moveToStage4: jest.fn()
  }
  const wrapper = shallow(<ShareToStudents {...mockProps} />)
  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
