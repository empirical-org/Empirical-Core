import { mount } from 'enzyme';
import * as React from 'react';

import { activityPack } from '../../../../../../test_data/activityPack';
import UnitTemplateMini from '../unit_template_mini';

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
