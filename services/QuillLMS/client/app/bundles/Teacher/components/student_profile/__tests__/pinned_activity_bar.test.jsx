import { mount } from 'enzyme';
import React from 'react';

import PinnedActivityBar from '../pinned_activity_bar';

describe('PinnedActivityBar component', () => {

  it('should render if it is being previewed', () => {
    const wrapper = mount(
      <PinnedActivityBar
        activityId={1}
        classroomUnitId={2}
        isBeingPreviewed={true}
        onShowPreviewModal={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot()
  });

  it('should render if it is not being previewed', () => {
    const wrapper = mount(
      <PinnedActivityBar
        activityId={1}
        classroomUnitId={2}
        isBeingPreviewed={false}
        onShowPreviewModal={() => {}}
      />
    );
    expect(wrapper).toMatchSnapshot()
  });
});
