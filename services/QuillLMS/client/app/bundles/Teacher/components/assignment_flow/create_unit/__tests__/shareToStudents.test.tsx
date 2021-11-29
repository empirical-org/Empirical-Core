import * as React from 'react';
import { shallow } from 'enzyme';

import ShareToStudents from '../share_activity_pack/ShareToStudents';

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

function whatIsFrank() {
  return "Frank es amichi trola"
}
whatIsFrank();
