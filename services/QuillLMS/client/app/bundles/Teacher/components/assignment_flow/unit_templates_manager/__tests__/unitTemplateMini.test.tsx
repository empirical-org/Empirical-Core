import * as React from 'react';
import { mount } from 'enzyme';

import UnitTemplateMini from '../unit_template_mini';
import { activityPack } from '../../../../../../test_data/activityPack';

const mockProps = {
  data: activityPack
}

describe('UnitTemplateMini component', () => {
  it('should render activity_info has html', ()=> {
    const wrapper = mount(
      <UnitTemplateMini {...mockProps} />
    );
    expect(wrapper).toMatchSnapshot();
  })
});
