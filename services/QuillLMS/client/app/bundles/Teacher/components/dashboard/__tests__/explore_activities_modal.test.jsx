import React from 'react';
import { shallow } from 'enzyme';

import ExploreActivitiesModal from '../explore_activities_modal.tsx'

describe('ExploreActivitiesModal component', () => {

  const wrapper = shallow(
    <ExploreActivitiesModal
      cancel={() => {}}
    />
  );

  it('should render ExploreActivitiesModal', () => {
    expect(wrapper).toMatchSnapshot()
  })

})
