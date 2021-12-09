import * as React from 'react';
import { shallow } from 'enzyme';

import ActivityPackInformation from '../share_activity_pack/activityPackInformation';

describe('ActivityPackInformation component', () => {
  const mockProps = {
    activityPackData: {},
    classroomData: {}
  }
  const wrapper = shallow(<ActivityPackInformation {...mockProps} />)
  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
