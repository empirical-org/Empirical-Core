import { mount } from 'enzyme';
import React from 'react';

import { activityPack } from '../../../../../../../test_data/activityPack';
import UnitTemplateProfileDescription from '../unit_template_profile_description';

const mockProps = {
  data: activityPack
}

describe('UnitTemplateProfileDescription component', () => {
  it('should render activity_info has html', ()=> {
    const wrapper = mount(
      <UnitTemplateProfileDescription {...mockProps} />
    );
    expect(wrapper).toMatchSnapshot();
  })
});
