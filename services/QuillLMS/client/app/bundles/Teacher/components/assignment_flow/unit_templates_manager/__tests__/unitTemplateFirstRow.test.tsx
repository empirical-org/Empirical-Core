import { mount } from 'enzyme';
import * as React from 'react';

import { activityPack } from '../../../../../../test_data/activityPack';
import UnitTemplateFirstRow from '../unit_template_first_row';

const mockProps = {
  data: activityPack
}

describe('UnitTemplateFirstRow component', () => {
  it('should render activity_info has html', ()=> {
    const wrapper = mount(
      <UnitTemplateFirstRow {...mockProps} />
    );
    expect(wrapper).toMatchSnapshot();
  })
});
