import { mount } from 'enzyme';
import React from 'react';

import PinnedActivityModal from '../pinned_activity_modal';

describe('PinnedActivityModal component', () => {

  it('should render', () => {
    const wrapper = mount(
      <PinnedActivityModal
        activityId={1}
        classroomUnitId={2}
        name='An Activity'
        teacherName='Mr. Teacherman'
      />
    );
    expect(wrapper).toMatchSnapshot()
  });
});
