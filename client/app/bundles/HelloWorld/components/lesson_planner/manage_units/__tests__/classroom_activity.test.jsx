import React from 'react';
import { shallow } from 'enzyme';

import ClassroomActivity from '../classroom_activity';

describe('ClassroomActivity component', () => {

  it('should not render Recommendations div if data.activity_id is diagnostic id', () => {
      const wrapper = shallow(
        <ClassroomActivity data={{activity_id: 412}} />
      );
      expect(wrapper.find('.recommendations-button').length).toBe(0);
  });

  it('should not render Recommendations div if it is not on the activity analysis page', () => {
      const wrapper = shallow(
        <ClassroomActivity data={{activity_id: 413}} />
      );
      expect(wrapper.find('.recommendations-button').length).toBe(0);
  });

  it('should render Recommendations div if data.activity_id is diagnostic id and it is on the activity analysis page', () => {
      const wrapper = shallow(
        <ClassroomActivity data={{activity_id: 413}} />
      );
      expect(wrapper.find('.recommendations-button').length).toBe(1);
  });


});
