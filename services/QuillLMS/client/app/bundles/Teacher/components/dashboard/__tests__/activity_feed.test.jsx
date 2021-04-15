import * as React from 'react';
import { mount } from 'enzyme';

import ActivityFeed from '../activity_feed';

describe('ActivityFeed component', () => {

  it('should render when there are no activities', () => {
    const wrapper = mount(<ActivityFeed />);
    expect(wrapper).toMatchSnapshot()
  });

});
