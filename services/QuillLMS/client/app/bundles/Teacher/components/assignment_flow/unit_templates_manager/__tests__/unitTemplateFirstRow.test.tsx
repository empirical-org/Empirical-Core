import * as React from 'react';
import { mount } from 'enzyme';

import UnitTemplateFirstRow from '../unit_template_first_row';
import { activityPack } from '../../../../../../test_data/activityPack';

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
